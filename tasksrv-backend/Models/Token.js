

// server/models/Token.js
const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
});

module.exports = mongoose.model('Token', TokenSchema);
