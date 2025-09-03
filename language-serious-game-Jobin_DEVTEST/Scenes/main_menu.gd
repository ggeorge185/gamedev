extends Control

func _ready():
	$CenterContainer/VBoxContainer/StartButton.pressed.connect(_on_start_game)
	$CenterContainer/VBoxContainer/MapButton.pressed.connect(_on_open_map)
	
func _on_start_game():
	get_tree().change_scene_to_file("res://Scenes/GameController.tscn")

func _on_open_map():
	get_tree().change_scene_to_file("res://Scenes/GameMap.tscn")
