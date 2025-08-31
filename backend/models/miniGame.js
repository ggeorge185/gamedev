const mongoose = require('mongoose');

const miniGameSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: String,
  deposit: String,
  image: String,
  description: String,
  isScam: Boolean,
  redFlags: [String],
  greenFlags: [String],
});

module.exports = mongoose.model('MiniGame', miniGameSchema);
