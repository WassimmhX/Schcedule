from ai.Tools import AiTools
#print(AiTools.search_for_user_schedule.run("Admin@gmail.com"))
#print(AiTools.search_day_informations.run({"schedule_name":"L2_TIC","schedule_type":"Class","day":"Monday"}))
#print(AiTools.get_current_day.func())
#print(AiTools.search_by_time.run({"schedule_name":"L2_TIC","schedule_type":"Class","day":"Monday","target_time":"10:30"}))
#print(AiTools.check_free_time.run({"schedule_name":"L2_TIC","schedule_type":"Class","day":"Friday"}))
#print(AiTools.find_subject_sessions.run({"schedule_name":"CPI_1_TD2","schedule_type":"Class","subject_keyword":"Algorithme"}))
print(AiTools.get_schedule_type.run("vacataire2"))
print(AiTools.check_free_time.run({"schedule_name":"vacataire2","schedule_type":"Teacher","day":"Monday"}))