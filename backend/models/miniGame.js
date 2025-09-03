import mongoose from "mongoose";

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
}, { timestamps: true });

const MiniGame = mongoose.model('MiniGame', miniGameSchema);

export default MiniGame;
