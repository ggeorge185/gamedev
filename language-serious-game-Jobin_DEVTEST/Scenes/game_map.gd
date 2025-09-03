extends Control

var current_level = 1
var max_level = 5

func _ready():
    setup_points()

func setup_points():
    for i in range(1, max_level + 1):
        var point = get_node("Points/Point" + str(i))
        point.pressed.connect(_on_point_pressed.bind(i))
        
        # Disable points that aren't unlocked yet
        if i > current_level:
            point.disabled = true

func _on_point_pressed(level: int):
    if level <= current_level:
        # Load the memory game scene with appropriate data
        var memory_game = preload("res://Scenes/MiniGames/MemoryGame.tscn").instantiate()
        memory_game.task_data = load_level_data(level)
        memory_game.task_completed.connect(_on_level_completed)
        add_child(memory_game)

func load_level_data(level: int):
    # Load specific word pairs for each level
    var data = {
        "type": "memory",
        "time_limit": 60,
        "pairs": []
    }
    
    # You can customize the pairs for each level
    match level:
        1:
            data.pairs = [
                { "de": "Hallo", "en": "Hello" },
                { "de": "Tschüss", "en": "Goodbye" }
            ]
        2:
            data.pairs = [
                { "de": "Brot", "en": "Bread" },
                { "de": "Wasser", "en": "Water" }
            ]
        # Add more levels as needed
    
    return data

func _on_level_completed(success: bool):
    if success:
        current_level = min(current_level + 1, max_level)
        setup_points()  # Update available points