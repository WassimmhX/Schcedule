
from langchain_ollama import ChatOllama
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import AIMessage,HumanMessage
from langchain.callbacks.base import BaseCallbackHandler
from ai.Tools import AiTools
from typing import AsyncGenerator, Dict, Any, List
import logging
import asyncio
import time
logging.basicConfig(level=logging.WARNING, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
class StreamingCallbackHandler(BaseCallbackHandler):
    """Enhanced callback handler for streaming agent responses."""
    
    def __init__(self, queue: asyncio.Queue):
        """Initialize the callback handler with a queue for streaming responses.
        
        Args:
            queue: An asyncio Queue to stream responses.
        """
        self.queue = queue
        self.start_time = time.time()
        
    async def on_llm_start(self, serialized: Dict[str, Any], prompts: List[str], **kwargs):
        """Log when LLM starts processing."""
        await self.queue.put({"type": "status", "content": "Thinking..."})
    
    async def on_llm_new_token(self, token: str, **kwargs):
        """Stream individual tokens."""
        await self.queue.put({"type": "token", "content": token})
    
    async def on_llm_end(self, response, **kwargs):
        """Log when LLM finishes processing."""
        elapsed = time.time() - self.start_time
        logger.debug(f"LLM processing completed in {elapsed:.2f} seconds")
    async def on_chain_start(self, serialized: Dict[str, Any], inputs: Dict[str, Any], **kwargs):
        """Log when chain execution starts."""
        chain_name = "unnamed"
        
        # Try to get the name from serialized first
        if serialized and isinstance(serialized, dict):
            chain_name = serialized.get('name', chain_name)
        
        # If not found, try to get it from kwargs
        if chain_name == "unnamed" and 'name' in kwargs:
            chain_name = kwargs['name']
        
        logger.debug(f"Starting chain: {chain_name}")
        
    async def on_chain_end(self, outputs: Dict[str, Any], **kwargs):
        """Handle chain completion and final answer."""
        final_output = outputs.get('output', '')
        await self.queue.put({
            "type": "final", 
            "content": final_output
        })
        elapsed = time.time() - self.start_time
        logger.debug(f"Chain completed in {elapsed:.2f} seconds with output length: {len(str(final_output))}")
        
    async def on_chain_error(self, error: Exception, **kwargs):
        """Handle chain execution errors."""
        await self.queue.put({
            "type": "error", 
            "content": f"An error occurred: {str(error)}"
        })
        logger.error(f"Chain error: {str(error)}", exc_info=True)
        
    async def on_agent_action(self, action, **kwargs):
        """Log agent actions and properly identify tool calls."""
        logger.debug(f"Agent action: {action}")
        
        # This is where we can properly capture tool calls
        if hasattr(action, 'tool'):
            tool_name = action.tool
            tool_input = action.tool_input
            
            await self.queue.put({
                "type": "tool_start",
                "content": f"Using tool: {tool_name}",
                "details": {"name": tool_name, "input": str(tool_input)}
            })
            
            self.current_tool = tool_name
    
    async def on_agent_finish(self, finish, **kwargs):
        """Handle agent finish."""
        logger.debug(f"Agent finished with output: {finish}")
class AIAgent:
    def __init__(self, model_name: str = "qwen2.5", temperature: float = 0,queue:asyncio.Queue=None):
        """Initialize the AI Agent with the specified model and tools."""
        if queue is None:
            queue = asyncio.Queue()
        self.model_name = model_name
        self.temperature = temperature
        self.tools_instance = AiTools.tools()
        self.chat_history = []
        self.queue=queue
        self.callback_handler = StreamingCallbackHandler(self.queue)
        callbacks = [self.callback_handler]
        # Initialize LLM
        self.llm = ChatOllama(
            model=self.model_name, 
            temperature=self.temperature,
            callbacks=callbacks,
            num_predict=512, 
            num_ctx=4096,         
            streaming=True,  
            repeat_penalty=1.1,  
            top_p=0.9,            
            top_k=40,             
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
            - Only use tools when the request requires data retrieval
            - For general knowledge questions or conversational responses, answer directly without using tools
            - Be efficient - use tools only when necessary and appropriate
            - After using tools, provide a concise response incorporating all relevant outputs

            3. REASONING PROCESS:
            - Think step-by-step about what tools are needed and in what order
            - Identify dependencies between operations and sequence tool calls accordingly
            - For complex queries, outline your approach before making tool calls
            - Review final results for accuracy and completeness

            4. COMMON SCENARIOS:
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
            callbacks=callbacks,
            handle_parsing_errors=True,
            max_iterations=8,
            early_stopping_method="generate"
        )
    
    async def generate_response(self, input_query: str) -> AsyncGenerator[str, None]:
        """Generate streaming response for the given input query."""
        if not self.queue:
            raise RuntimeError("Queue not initialized. Cannot stream response.")
        self.chat_history.append(HumanMessage(content=input_query))
        asyncio.create_task(self._run_agent(input_query))
        while True:
            item = await self.queue.get()
            yield item
            if item["type"] in ("final", "error"):  # stream ends
                break
    async def _run_agent(self, input_query: str):
        """Run the agent and handle history and fallback."""
        try:
            await self.agent_executor.ainvoke({
                "input": input_query,
                "chat_history": self.chat_history
            })

        except Exception as e:
            logger.error(f"Agent error: {e}", exc_info=True)
            error_msg = f"Agent error: {e}"
            await self.queue.put({"type": "error", "content": error_msg})
            self.chat_history.append(AIMessage(content=error_msg))