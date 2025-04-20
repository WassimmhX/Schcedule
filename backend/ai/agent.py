
from langchain_ollama import ChatOllama
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import AIMessage,HumanMessage
from Tools import tools
from typing import AsyncGenerator, Dict, Any
import logging
import asyncio
logging.basicConfig(level=logging.WARNING, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AIAgent:
    def __init__(self, model_name: str = "qwen2.5", temperature: float = 0):
        """Initialize the AI Agent with the specified model and tools."""
        self.model_name = model_name
        self.temperature = temperature
        self.tools_instance = tools()
        self.chat_history = []
        # Initialize LLM
        self.llm = ChatOllama(
            model=self.model_name, 
            temperature=self.temperature,
            request_timeout=60.0
        )
        
        # Initialize agent prompt
        self.agent_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a helpful assistant with access to tools. Analyze requests carefully before deciding which tools to use and in what order.

            **IMPORTANT GUIDELINES:

            1. SEQUENTIAL TOOL USAGE:
            - For complex tasks requiring multiple steps, break the problem into logical sub-tasks
            - Execute tools in sequence, using the output of one tool as input to the next when appropriate
            - Never combine multiple operations into a single tool call - each distinct operation needs its own tool call
            - Keep track of intermediate results and use them in subsequent tool calls

            2. GENERAL TOOL USAGE:
            - Only use tools when the request requires computational operations, data retrieval, or API calls
            - For general knowledge questions or conversational responses, answer directly without using tools
            - Be efficient - use tools only when necessary and appropriate
            - After using tools, provide a concise response incorporating all relevant outputs

            3. REASONING PROCESS:
            - Think step-by-step about what tools are needed and in what order
            - Identify dependencies between operations and sequence tool calls accordingly
            - For complex queries, outline your approach before making tool calls
            - Review final results for accuracy and completeness

            4. COMMON SCENARIOS:
            - Mathematical expressions with multiple operations: Follow order of operations (PEMDAS)
            - Data retrieval and transformation: First retrieve data, then transform as needed
            - Compound research questions: Break into sub-questions and build comprehensive answers

            Your goal is to be helpful and efficient, using tools in a logical sequence to accurately complete complex tasks while providing clear explanations of your process.
             """),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])
        
        # Initialize agent executor
        self.agent = create_tool_calling_agent(llm=self.llm, tools=self.tools_instance, prompt=self.agent_prompt)
        self.agent_executor = AgentExecutor(
            agent=self.agent, 
            tools=self.tools_instance, 
            stream=True,
            verbose=False,
            handle_parsing_errors=True,
            max_iterations=8,
            early_stopping_method="generate"
        )
    
    async def generate_response(self, input_query: str) -> AsyncGenerator[str, None]:
        """Generate streaming response for the given input query."""
        
        config = RunnableConfig(tags=["streaming"])
        self.chat_history.append(HumanMessage(content=input_query))
        try:
            # Process the query through the agent
            buffer = ""
            async for chunk in self.agent_executor.astream({"input": input_query,"chat_history":self.chat_history}, config=config):
                if "steps" in chunk:
                    yield chunk["steps"][0].action.log
                    await asyncio.sleep(0.2)
                if "output" in chunk:
                    text = chunk["output"]
                    buffer += text
                    yield text
                    await asyncio.sleep(0.2)
            if buffer:
                self.chat_history.append(AIMessage(content=buffer))
            # If no output was generated, fallback to direct LLM call
            if not buffer:
                direct_response = await self.llm.ainvoke(input_query)
                if hasattr(direct_response, "content"):
                    yield direct_response.content
                    await asyncio.sleep(0.2)
                response_text = direct_response.content if hasattr(direct_response, "content") else str(direct_response)
                self.chat_history.append(AIMessage(content=response_text))
                    
        except Exception as e:
            logger.error(f"Error processing query '{input_query}': {str(e)}", exc_info=True)
            error_message = f"Sorry, I encountered an error: {str(e)}"
            self.chat_history.append(AIMessage(content=error_message))
            yield error_message
