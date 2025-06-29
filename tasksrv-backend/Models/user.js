const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String, // Store hashed passwords in real apps
});

module.exports = mongoose.model('User', userSchema);
