extends Control

signal restart_requested
signal quit_requested

func setup(success: bool, score: int):
	$PanelContainer/VBoxContainer/ResultLabel.text = "Success!" if success else "Game Over!"
	$PanelContainer/VBoxContainer/ScoreLabel.text = "Score: %d" % score

func _on_restart_button_pressed():
	restart_requested.emit()

func _on_quit_button_pressed():
	quit_requested.emit()
