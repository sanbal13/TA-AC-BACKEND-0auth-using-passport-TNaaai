const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  name: String,
  email: { type: String },
  username: { type: String, unique: true },
  photo: { type: String },
}, { timestamp: true });

module.exports = mongoose.model('User', userSchema);
