const express = require('express');
const router = express.Router();
const MiniGame = require('../models/miniGame');

// Get all
router.get('/', async (req, res) => {
  const games = await MiniGame.find();
  res.json(games);
});

// Add new
router.post('/', async (req, res) => {
  const game = new MiniGame(req.body);
  await game.save();
  res.json(game);
});

// Update
router.put('/:id', async (req, res) => {
  const game = await MiniGame.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(game);
});

// Delete
router.delete('/:id', async (req, res) => {
  await MiniGame.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;