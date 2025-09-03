extends Node 
var tasks = []
var current_task_index = 0
var score = 0

func _ready() -> void:
	load_tasks()
	start_next_task() 
	
func load_tasks():
	#var file = FileAccess.open("res://data/memory_game_data.json", FileAccess.READ)
	var game_info = GameData.game_info
	#var content = game_info.get_as_text()
	#var parsed = JSON.parse_string(game_info)
	#print("parsed data is: ", parsed)
	#tasks = parsed if parsed is Array else []\
	tasks = game_info
	
func start_next_task():
	if current_task_index >= tasks.size():
		print("Game complete! Score: ", score)
		return
	var task = tasks[current_task_index]
	print("Starting task: ", task["title"])
	
	if (task.type == "memory"):
		var memory_scene = load("res://Scenes/MiniGames/MemoryGame.tscn").instantiate()
		memory_scene.task_data = task
		memory_scene.task_completed.connect(_on_task_complete)
		add_child(memory_scene)
		
func _on_task_complete(success: bool):
	if success:
		score += 3
	current_task_index += 1
	start_next_task()		
		
