extends Node2D

@onready var clues_panel = $UI/CluesPanel
@onready var input_field = $UI/InputField
@onready var submit_button = $UI/SubmitButton
@onready var score_label = $UI/ScoreLabel
@onready var found_words_list = $UI/FoundWordsList  
@onready var vocab_info_label = $UI/VocabInfoLabel 
@onready var grid_container = $GridContainer
@onready var http_request = $HTTPRequest

# Game Variables
var GRID_SIZE = 10
var grid_letters = [] 
var placed_words = []  
var vocabulary_words = []  
var found_words_count = 0
var total_words_to_find = 5
var current_vocabulary_set = null

# Grid UI elements
var letter_buttons = []

func _ready():
	hide_main_menu()
	setup_ui()
	connect_signals()
	load_admin_vocabulary() 

func hide_main_menu():
	var main_menu = get_node_or_null("../MainMenu")
	if main_menu:
		main_menu.visible = false

func setup_ui():
	grid_container.columns = GRID_SIZE
	letter_buttons = []
	
	for i in range(GRID_SIZE * GRID_SIZE):
		var button = Button.new()
		button.custom_minimum_size = Vector2(40, 40)
		button.flat = true
		button.disabled = true
		button.add_theme_color_override("font_color", Color.WHITE)
		grid_container.add_child(button)
		letter_buttons.append(button)
	
	grid_letters = []
	for i in range(GRID_SIZE):
		grid_letters.append([])
		for j in range(GRID_SIZE):
			grid_letters[i].append("")

func connect_signals():
	submit_button.pressed.connect(_on_submit_word)
	input_field.text_submitted.connect(_on_submit_word)
	http_request.request_completed.connect(_on_http_request_completed)

func load_admin_vocabulary():
	var url = "http://localhost:5000/api/game/current-vocabulary"
	http_request.request(url)

func _on_http_request_completed(result: int, response_code: int, headers: PackedStringArray, body: PackedByteArray):
	if response_code == 200:
		var json = JSON.new()
		var parse_result = json.parse(body.get_string_from_utf8())
		if parse_result == OK:
			var data = json.data
			_on_vocabulary_loaded(data)
	else:
		print("Failed to load vocabulary. Response code: ", response_code)
		show_error_message("Failed to load vocabulary. Is the server running?")

func _on_vocabulary_loaded(vocab_data):
	current_vocabulary_set = vocab_data.vocabulary_set
	vocabulary_words = vocab_data.words
	
	update_vocab_info_display()
	
	generate_word_search_grid()
	
	display_english_clues()

func update_vocab_info_display():
	"""Show which vocabulary set is currently being used"""
	if current_vocabulary_set:
		vocab_info_label.text = "Topic: %s (%s)" % [current_vocabulary_set.name, current_vocabulary_set.category]

func generate_word_search_grid():
	placed_words.clear()
	found_words_count = 0
	
	var words_to_place = vocabulary_words.duplicate()
	words_to_place.shuffle()
	words_to_place = words_to_place.slice(0, min(total_words_to_find, words_to_place.size()))
	
	for i in range(GRID_SIZE):
		for j in range(GRID_SIZE):
			grid_letters[i][j] = ""
	
	for word_data in words_to_place:
		var german_word = word_data.word_de.to_upper()
		place_word_in_grid(german_word)
	
	fill_empty_spaces()
	
	update_grid_display()
	update_score_display()
	update_found_words_display()

func place_word_in_grid(word: String) -> bool:
	var max_attempts = 100
	var attempts = 0
	
	while attempts < max_attempts:
		var direction = randi() % 4 
		var start_pos = Vector2(randi() % GRID_SIZE, randi() % GRID_SIZE)
		
		if can_place_word(word, start_pos, direction):
			var end_pos = get_end_position(start_pos, direction, word.length())
			place_word_at_position(word, start_pos, direction)
			
			placed_words.append({
				"word": word,
				"start": start_pos,
				"end": end_pos,
				"direction": direction,
				"found": false
			})
			return true
		
		attempts += 1
	
	print("Could not place word: ", word)
	return false

func can_place_word(word: String, start_pos: Vector2, direction: int) -> bool:
	var pos = start_pos
	
	for i in range(word.length()):
		if pos.x < 0 or pos.x >= GRID_SIZE or pos.y < 0 or pos.y >= GRID_SIZE:
			return false
		
		if grid_letters[pos.y][pos.x] != "" and grid_letters[pos.y][pos.x] != word[i]:
			return false
		
		pos = get_next_position(pos, direction)
	
	return true

func get_next_position(pos: Vector2, direction: int) -> Vector2:
	match direction:
		0:  
			return Vector2(pos.x + 1, pos.y)
		1:
			return Vector2(pos.x, pos.y + 1)
		2: 
			return Vector2(pos.x + 1, pos.y + 1)
		3:  
			return Vector2(pos.x - 1, pos.y + 1)
		_:
			return pos

func get_end_position(start_pos: Vector2, direction: int, length: int) -> Vector2:
	var pos = start_pos
	for i in range(length - 1):
		pos = get_next_position(pos, direction)
	return pos

func place_word_at_position(word: String, start_pos: Vector2, direction: int):
	var pos = start_pos
	
	for i in range(word.length()):
		grid_letters[pos.y][pos.x] = word[i]
		pos = get_next_position(pos, direction)

func fill_empty_spaces():
	var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	
	for i in range(GRID_SIZE):
		for j in range(GRID_SIZE):
			if grid_letters[i][j] == "":
				grid_letters[i][j] = letters[randi() % letters.length()]

func update_grid_display():
	for i in range(GRID_SIZE):
		for j in range(GRID_SIZE):
			var button_index = i * GRID_SIZE + j
			letter_buttons[button_index].text = grid_letters[i][j]

func display_english_clues():
	for child in clues_panel.get_children():
		child.queue_free()
	
	var title_label = Label.new()
	title_label.text = "Find these words:"
	title_label.add_theme_color_override("font_color", Color.YELLOW)
	clues_panel.add_child(title_label)
	
	for i in range(min(total_words_to_find, vocabulary_words.size())):
		var word_data = vocabulary_words[i]
		var clue_label = Label.new()
		clue_label.text = "🔍 %s" % word_data.word_en
		clue_label.add_theme_color_override("font_color", Color.WHITE)
		clues_panel.add_child(clue_label)

func _on_submit_word(text: String = ""):
	var input_text = text if text != "" else input_field.text
	var german_word = input_text.strip_edges().to_upper()
	
	if german_word == "":
		return
	

	for word_data in placed_words:
		if word_data.word == german_word and not word_data.found:
			word_data.found = true
			highlight_word(word_data)
			found_words_count += 1
			update_score_display()
			update_found_words_display()
			input_field.text = ""
			
			show_correct_word_feedback()
			
	
			if found_words_count >= total_words_to_find:
				show_completion_message()
			return
	
	show_invalid_word_feedback()

func highlight_word(word_data: Dictionary):
	var pos = word_data.start
	var direction = word_data.direction
	
	for i in range(word_data.word.length()):
		var button_index = pos.y * GRID_SIZE + pos.x
		if button_index >= 0 and button_index < letter_buttons.size():
			letter_buttons[button_index].add_theme_color_override("font_color", Color.LIME_GREEN)
			letter_buttons[button_index].modulate = Color(1.2, 1.2, 1.2)  
		pos = get_next_position(pos, direction)

func update_score_display():
	score_label.text = "Found: %d/%d" % [found_words_count, total_words_to_find]

func update_found_words_display():
	for child in found_words_list.get_children():
		child.queue_free()
	
	# Add title
	var title_label = Label.new()
	title_label.text = "Words Found:"
	title_label.add_theme_color_override("font_color", Color.LIME_GREEN)
	found_words_list.add_child(title_label)
	
	for word_data in placed_words:
		if word_data.found:
			
			var english_word = ""
			for vocab_word in vocabulary_words:
				if vocab_word.word_de.to_upper() == word_data.word:
					english_word = vocab_word.word_en
					break
			
			var found_label = Label.new()
			found_label.text = "✓ %s (%s)" % [word_data.word, english_word]
			found_label.add_theme_color_override("font_color", Color.LIME_GREEN)
			found_words_list.add_child(found_label)

func show_correct_word_feedback():
	input_field.modulate = Color.LIME_GREEN
	var tween = create_tween()
	tween.tween_property(input_field, "modulate", Color.WHITE, 0.5)

func show_invalid_word_feedback():
	input_field.modulate = Color.RED
	var tween = create_tween()
	tween.tween_property(input_field, "modulate", Color.WHITE, 0.5)

func show_completion_message():
	print("Congratulations! You found all words!")
	var completion_label = Label.new()
	completion_label.text = "🎉 CONGRATULATIONS! 🎉\nYou found all words!"
	completion_label.add_theme_color_override("font_color", Color.GOLD)
	completion_label.position = Vector2(400, 300)
	add_child(completion_label)

func show_error_message(message: String):
	var error_label = Label.new()
	error_label.text = "Error: " + message
	error_label.add_theme_color_override("font_color", Color.RED)
	error_label.position = Vector2(20, 50)
	add_child(error_label)

func _on_back_to_menu():
	var main_menu = get_node_or_null("../MainMenu")
	if main_menu:
		main_menu.visible = true
		visible = false
