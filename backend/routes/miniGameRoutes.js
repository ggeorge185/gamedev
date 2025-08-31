import express from "express";
import MiniGame from "../models/miniGame.js";

const router = express.Router();

// Get all mini games
router.get("/", async (req, res) => {
  const games = await MiniGame.find();
  res.json(games);
});

// Add a mini game
router.post("/", async (req, res) => {
  const game = new MiniGame(req.body);
  await game.save();
  res.json(game);
});

// Update a mini game
router.put("/:id", async (req, res) => {
  const updated = await MiniGame.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete a mini game
router.delete("/:id", async (req, res) => {
  await MiniGame.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
