extends Control
var env = {}
#var memory_pairs = {}
#var game_info = {}

@onready var start_game_button = $CenterContainer/VBoxContainer/StartButton

func _ready():
	$CenterContainer/VBoxContainer/StartButton.pressed.connect(_on_start_game)
	$CenterContainer/VBoxContainer/MapButton.pressed.connect(_on_open_map)
	
func _on_start_game():
	#load the environment file and fetch the info from the db
	load_env()
	fetch_game_info()
	fetch_memory_pairs()

func _on_open_map():
	get_tree().change_scene_to_file("res://Scenes/GameMap.tscn")
	
func load_env():
	var env_file = FileAccess.open("res://.env", FileAccess.READ)
	if env_file:
		while not env_file.eof_reached():
			var line = env_file.get_line().strip_edges()
			if line == "" or line.begins_with("#"):
				continue
			var parts = line.split("=", false, 2)
			#print(parts)
			if parts.size() == 2:
				env[parts[0]] = parts[1]
		env_file.close()

func _on_game_info_complete(result, response_code, headers, body):
	#print("Result: ", result, "HTTP CODE: ", response_code)
	if response_code == 200:
		GameData.game_info = JSON.parse_string(body.get_string_from_utf8())
		print("The type of the game data is ", typeof(GameData.game_info))
		# print(GameData.game_info[0])
		#return data
		#fetch_memory_pairs()
	else:
		print("Failed to fetch task", result)

func _on_memory_pairs_complete(result, response_code, headers, body):
	print("Result: ", result, "HTTP CODE: ", response_code)
	if response_code == 200:
		GameData.memory_pairs = JSON.parse_string(body.get_string_from_utf8())
		# print(GameData.memory_pairs[0])
		get_tree().change_scene_to_file("res://Scenes/GameController.tscn")
	else:
		print("Failed to fetch memory pairs: ", result, response_code)

func fetch_game_info():
	var http = HTTPRequest.new()
	add_child(http)
	http.request_completed.connect(_on_game_info_complete)
	var url = env.get("GAME_INFO_API_URL", "")
	if url == "":
		print("API_URL not set in .env")
		return
	var err = http.request(url)
	if err != OK:
		print("error", err)
		
func fetch_memory_pairs():
	var http = HTTPRequest.new()
	add_child(http)
	http.request_completed.connect(_on_memory_pairs_complete)
	var url = env.get("MEMORY_PAIRS_API_URL", "")
	print(url)
	if url == "":
		print("MEMORY_PAIRS_API not set in .env")
		return 
	var err = http.request(url)
	if err != OK:
		print("error", err)
