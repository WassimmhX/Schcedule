from langchain_core.tools import tool
from backend.BdManager import *
from datetime import datetime
import pytz  

class AiTools:
    data=schedules(get_db())
    @staticmethod
    @tool
    def get_current_day() -> str:
        """
        Returns the current day of the week in English.
        
        This tool uses the Tunisia timezone (Africa/Tunis) to determine the current day.
        It returns the full English name of the day (Monday, Tuesday, etc.).
        
        Returns:
            str: The current day of the week in English (e.g., "Monday", "Tuesday").
        """
        # Using Tunisia timezone
        tz = pytz.timezone('Africa/Tunis')
        now = datetime.now(tz)
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        return days[now.weekday()]

    def normalize_time_format(time_str: str) -> str:
        """Convert various time formats to 24-hour format (HH:MM)"""
        # Handle simple hour inputs like "10" -> "10:00"
        if time_str.isdigit():
            time_str = f"{time_str}:00"
        
        # Try to parse the time
        try:
            # Handle various formats (10:00, 10h00, 10h, 10am, etc.)
            time_str = time_str.lower().replace('h', ':').replace('am', '').replace('pm', '')
            
            # Add minutes if not specified
            if ':' not in time_str:
                time_str += ':00'
                
            # Parse the time to ensure it's valid
            parsed_time = datetime.strptime(time_str, "%H:%M").time()
            return parsed_time.strftime("%H:%M")
        except ValueError:
            # Return original if parsing fails
            return time_str

    def is_time_within_session(target_time: str, start_time: str, end_time: str) -> bool:
        """Check if a target time falls within a session time range."""
        try:
            target = datetime.strptime(target_time, "%H:%M").time()
            start = datetime.strptime(start_time, "%H:%M").time()
            end = datetime.strptime(end_time, "%H:%M").time()
            
            return start <= target <= end
        except ValueError:
            # In case of parsing errors, return False
            return False

    @staticmethod
    @tool
    def check_free_time(schedule_name: str, schedule_type: str, day: str) -> list:
        """
        Find free time slots on a given day.
        Parameters:
            - schedule_name: Name of the schedule
            - schedule_type: Type of schedule
            - day: Day to check (e.g., "Monday")
            - start_hour: Start of day to check (default: 8 AM)
            - end_hour: End of day to check (default: 6 PM)
        Returns a list of the actual free time slots for a specific day
        """
        day=AiTools.translate_day_to_french(day)
        day_schedule = find_day_of_schedule(AiTools.data,schedule_name,day,schedule_type)
        start_hour=8
        end_hour=18
        busy_blocks = []
        for session in day_schedule:
            start, end = session['time'].split(' - ')
            start_dt = datetime.strptime(start, "%H:%M").time()
            end_dt = datetime.strptime(end, "%H:%M").time()
            busy_blocks.append((start_dt, end_dt))
        
        busy_blocks.sort(key=lambda x: x[0])
        
        free_blocks = []
        current_time = datetime.strptime(f"{start_hour}:00", "%H:%M").time()
        day_end = datetime.strptime(f"{end_hour}:00", "%H:%M").time()
        
        for start, end in busy_blocks:
            if current_time < start:
                free_blocks.append({
                    'start': current_time.strftime("%H:%M"),
                    'end': start.strftime("%H:%M")
                })
            current_time = max(current_time, end)
        
        if current_time < day_end:
            free_blocks.append({
                'start': current_time.strftime("%H:%M"),
                'end': day_end.strftime("%H:%M")
            })
        
        return free_blocks

    @staticmethod
    @tool
    def find_subject_sessions(schedule_name: str, schedule_type: str, subject_keyword: str) -> dict:
        """
        Find all sessions of a specific subject across the week.
        Parameters:
            - schedule_name: The name of the schedule
            - schedule_type: The type of schedule  
            - subject_keyword: Keyword to search in subject names
        Returns a dictionary mapping days to matching sessions
        """
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        results = {}
        
        for day in days:
            day=AiTools.translate_day_to_french(day)
            day_schedule = find_day_of_schedule(AiTools.data,schedule_name,day,schedule_type)
            matching_sessions = []
            
            for session in day_schedule:
                if subject_keyword.lower() in session['subject'].lower():
                    matching_sessions.append(session)
            
            if matching_sessions:
                results[day] = matching_sessions
        
        return results
    @staticmethod
    @tool
    def search_for_user_schedule_information(userEmail:str)->dict|None:
        """
        Retrieves a user's schedule information based on their email address.
        
        This tool looks up a user in the database and returns their associated schedule
        information, including the schedule name and type.
        
        IMPORTANT USAGE GUIDELINES:
        - Use ONLY when the user explicitly refers to their own schedule
        - Use ONLY when the user's email is available in the conversation context
        - DO NOT use for queries about another person's schedule (teachers, other students, etc.)
        - DO NOT use if the schedule name is already provided or clearly implied
        
        Parameters:
            userEmail (str): Email address of the user requesting schedule information
        
        Returns:
            dict or None: A dictionary containing:
                          - 'name': The name/identifier of the user's schedule
                          - 'type': The type of schedule (typically "Class" for students)
                          Returns None if no schedule information is found for the user.
        
        Example return value:
            {'name': 'Group-3A21', 'type': 'Class'}
        """
        schedule=getUserAttribute(get_db(),userEmail,"mySchedule")
        return schedule

    @staticmethod
    @tool
    def get_schedule_type(schedule_name:str)->str:
        """
        Determines the type of a schedule based on its name or identifier.
        
        This tool queries the database to identify whether a schedule name refers
        to a class (student group), a teacher, or a room. Use this tool when you 
        need to determine the schedule type before using other schedule-related tools.
        
        Parameters:
            schedule_name (str): The name or identifier of the schedule to check
                                (could be a class name, teacher name, or room name)
        
        Returns:
            str: The type of schedule, one of: "Class", "Teacher", or "Room"
                 Returns an error message if the schedule is not found.
        
        Example:
            - get_schedule_type("Prof. Johnson") might return "Teacher"
            - get_schedule_type("Group-3A21") might return "Class"
            - get_schedule_type("Room-204") might return "Room"
        """
        return getScheduleType(schedule_name)
    @staticmethod
    @tool
    def retrieve_schedule_information(schedule_name:str,schedule_type:str)->list:
        """
        Retrieves the complete weekly schedule for a specified class, teacher, or room.
        
        This tool returns all sessions in the schedule across all days of the week.
        It provides comprehensive information about each session including subject,
        time, teacher, and room.
        
        Parameters:
            schedule_name (str): The name or identifier of the schedule to retrieve
                                (could be a class name, teacher name, or room name)
            schedule_type (str): Type of schedule - must be exactly one of:
                                "Class", "Teacher", or "Room"
                                (Use the get_schedule_type tool if uncertain)
        
        Returns:
            list: A list of schedule entries organized by day, where each entry contains:
                  - 'day': Day of the week in French (e.g., "Lundi", "Mardi")
                  - 'subject': Name of the subject
                  - 'time': Time slot in "HH:MM - HH:MM" format
                  - 'teacher': Name of the teacher
                  - 'room': Room identifier
        
        Example return value:
            [
                {"day": "Lundi", "subject": "Mathematics", "time": "10:00 - 12:00", "teacher": "Dr. Smith", "room": "A101"},
                {"day": "Lundi", "subject": "Physics", "time": "14:00 - 16:00", "teacher": "Dr. Brown", "room": "Lab2"},
                {"day": "Mardi", "subject": "English", "time": "08:00 - 10:00", "teacher": "Ms. Jones", "room": "B205"}
            ]
        """
        #day=AiTools.translate_day_to_french(day)
        #return find_day_of_schedule(AiTools.data,schedule_name,day,schedule_type)
        return find_schedule(AiTools.data,schedule_name,schedule_type)
        
    def translate_day_to_french(day:str):
        day=day.lower()
        days = {
            "monday": "Lundi",
            "tuesday": "Mardi",
            "wednesday": "Mercredi",
            "thursday": "Jeudi",
            "friday": "Vendredi",
            "saturday": "Samedi",
            "sunday": "Dimanche"
        }
        day_lower = day.lower()
        return days.get(day_lower, "Invalid day")
    @staticmethod
    def tools():
        return [
            AiTools.search_for_user_schedule_information, 
            AiTools.get_current_day,
            AiTools.get_schedule_type, 
            AiTools.retrieve_schedule_information,
        ]