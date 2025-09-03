extends Control

signal task_completed(success: bool)

@onready var grid = $GridContainer
@onready var move_label = $MoveLabel
@onready var timer_label = $TimerLabel

var task_data = {}
var selected_cards = []
var matched_pairs = 0
var move_limit = 25
var current_moves = 0
var card_scene = preload("res://Scenes/MiniGames/Card.tscn")
var seconds_left: int = 0
var game_over_screen = preload("res://Scenes/GameOver.tscn")
var input_locked = false

func _ready():
	setup_game()
	print("Task data for the game ", task_data)
	print()
	start_timer(task_data.get("time_limit", 5))
	print("Timer Label: ", timer_label.text)

func setup_game():
	#var pairs = task_data.get("pairs", []);
	#change to the db
	var pairs = GameData.memory_pairs
	#print(pairs)
	var all_words = []
	for pair in pairs:
		all_words.append({ "word": pair.word_de, "pair_id": pair.word_de })
		all_words.append({ "word": pair.word_en, "pair_id": pair.word_de })

	all_words.shuffle()
	for entry in all_words:
		var card = card_scene.instantiate()
		card.word = entry.word
		card.set_meta("pair_id", entry.pair_id)
		card.card_flipped.connect(_on_card_flipped)
		grid.add_child(card)

func _on_card_flipped(card):
	print("input lock", input_locked)
	if input_locked:
		return
	selected_cards.append(card)
	if selected_cards.size() == 2:
		input_locked = true
		check_match()

func check_match():
	#var [card1, card2] = selected_cards
	var card1 = selected_cards[0]
	var card2 = selected_cards[1]
	current_moves += 1
	update_ui()

	if card1.get_meta("pair_id") == card2.get_meta("pair_id"):
		card1.mark_as_matched()
		card2.mark_as_matched()
		matched_pairs += 1
		selected_cards.clear()
		input_locked = false
		if matched_pairs == GameData.memory_pairs.size():
			show_game_over(true)
			task_completed.emit(true)
			return
	else:
		await get_tree().create_timer(1.0).timeout
		card1.conceal()
		card2.conceal()
		selected_cards.clear()
		input_locked = false

	if current_moves >= move_limit:
		show_game_over(false)
		task_completed.emit(false)
		return

func update_ui():
	move_label.text = "Moves: %d/%d" % [current_moves, move_limit]

func start_timer(seconds):
	seconds_left = seconds
	var timer = Timer.new()
	timer.wait_time = 1
	timer.autostart = true
	timer.one_shot = false
	timer.timeout.connect(_on_timer_tick)
	add_child(timer)

func _on_timer_tick():
	seconds_left -= 1
	timer_label.text = "Time: %ds" %seconds_left
	if seconds_left <= 0:
		show_game_over(false)
		task_completed.emit(false)
		queue_free()

func show_game_over(success: bool):
	var screen = game_over_screen.instantiate()
	screen.setup(success, current_moves)
	screen.restart_requested.connect(_on_restart_requested)
	screen.quit_requested.connect(_on_quit_requested)
	add_child(screen)

func _on_restart_requested():
	get_tree().reload_current_scene()

func _on_quit_requested():
	get_tree().change_scene_to_file("res://Scenes/MainMenu.tscn")
