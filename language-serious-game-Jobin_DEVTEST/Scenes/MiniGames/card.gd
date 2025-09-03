extends Button

signal card_flipped(card: Node)

var word: String = ""
var is_revealed: bool = false
var is_matched: bool = false
const FLIP_DURATION = 0.3

@onready var label = $Label

func _ready() -> void:
	label.text = ""
	pressed.connect(_on_pressed)
	
func _on_pressed():
	if not is_revealed and not is_matched:
		reveal()
		card_flipped.emit(self)
	
func reveal():
	is_revealed = true
	_play_flip_animation(true)

func conceal():
	is_revealed = false
	_play_flip_animation(false)
	
func mark_as_matched():
	is_matched = true
	self.disabled = true

func _play_flip_animation(revealing: bool):
	var tween = create_tween().set_trans(Tween.TRANS_QUAD)
	
	# First half of the flip
	tween.tween_property(self, "scale:x", 0.0, FLIP_DURATION / 2.0).from(1.0)
	
	# Update text in the middle of the animation
	tween.tween_callback(func():
		label.text = word if revealing else ""
	)
	
	# Second half of the flip
	tween.tween_property(self, "scale:x", 1.0, FLIP_DURATION / 2.0).from(0.0)
