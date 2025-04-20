from langchain_core.tools import tool
from backend.BdManager import *
from datetime import datetime
import pytz  

class AiTools:
    data=schedules(get_db())
    @staticmethod
    @tool
    def get_current_day() -> str:
        """Returns the current day (today) in English."""
        # Using Tunisia timezone
        tz = pytz.timezone('Africa/Tunis')
        now = datetime.now(tz)
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        return days[now.weekday()]

    @staticmethod
    @tool
    def search_by_time(schedule_name: str, schedule_type: str, day: str, target_time: str) -> list:
        """
        Find what sessions are happening at a specific time on a given day.
        Parameters:
            - schedule_name: The name of the schedule
            - schedule_type: The type of schedule
            - day: The day to search (e.g., "Monday")
            - target_time: The time to search for, types of time authorized : (HH:MM e.g., 10:30), (HHhMM e.g., 10h30), (HHh e.g., 10h), (HH:MMAM e.g., 10:30AM), (HH:MMPM e.g., 2:30PM)
        """
        # Convert time format if needed (handle both 12h and 24h formats)
        target_time = AiTools.normalize_time_format(target_time)
        day=AiTools.translate_day_to_french(day)
        day_schedule = find_day_of_schedule(AiTools.data,schedule_name,day,schedule_type)
        matching_sessions = []
        
        for session in day_schedule:
            start_time, end_time = session['time'].split(' - ')
            if AiTools.is_time_within_session(target_time, start_time, end_time):
                matching_sessions.append(session)
        
        return matching_sessions

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
    def search_for_user_schedule(userEmail:str)->dict|None:
        """
            Get the user's schedule information (name and type) using their email.

            *** Use this ONLY if ***:
                - The user explicitly refers to **their own schedule** (e.g., "my schedule")
                - And the user's email is available.
                - DO NOT use this tool if the query is about another person's schedule (like a teacher or group).
                - DO NOT use this tool if the schedule name is already provided or implied.

            Returns:
            A dictionary with the user's schedule name and type, or None if not found.
        """
        schedule=getUserAttribute(get_db(),userEmail,"mySchedule")
        return schedule

    @staticmethod
    @tool
    def get_schedule_type(schedule_name:str)->str:
        """Retrieve the type of a schedule by providing its name. The name can be a teacher name, a room or a class."""
        return getScheduleType(schedule_name)
    @staticmethod
    @tool
    def search_informations(schedule:str,schedule_type:str,day:str)->list:
        """ Get detailed information for a specific day in a schedule.
            Returns session begin time and end time, teacher, room, and subject for the given day.
            Parameters:
                - schedule: The name of the schedule (can be a class's name, a teacher's name or a room's name).
                - schedule_type: The type of the schedule it can be only one of these three and written exactly like that:
                    1-Class
                    2-Teacher
                    3-Room
                - day: The day to search for (e.g., "Monday").
        """
        day=AiTools.translate_day_to_french(day)
        return find_day_of_schedule(AiTools.data,schedule,day,schedule_type)
        
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
            AiTools.get_current_day,
            AiTools.search_by_time, 
            AiTools.check_free_time,
            AiTools.find_subject_sessions,
            AiTools.search_for_user_schedule, 
            AiTools.get_schedule_type, 
            AiTools.search_informations
        ]