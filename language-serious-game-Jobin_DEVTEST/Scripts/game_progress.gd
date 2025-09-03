extends Node

var current_level := 1
var max_level := 5

func save_progress():
    var save_data = {
        "current_level": current_level
    }
    var save_file = FileAccess.open("user://progress.save", FileAccess.WRITE)
    save_file.store_line(JSON.stringify(save_data))

func load_progress():
    if FileAccess.file_exists("user://progress.save"):
        var save_file = FileAccess.open("user://progress.save", FileAccess.READ)
        var json_string = save_file.get_line()
        var data = JSON.parse_string(json_string)
        if data:
            current_level = data.current_level