// models/botSettings.js

const mongoose = require("mongoose");

const botSettingsSchema = new mongoose.Schema({
  targetPrice: {
    type: Number,
    required: true,
  },
  lowerTargetPrice: {
    type: Number,
    required: true,
  },
  sellAmountUSD: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("BotSettings", botSettingsSchema);
