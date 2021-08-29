const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  username: { type: String, unique: true },
  photo: { type: String },
}, { timestamp: true });

module.exports = mongoose.model('OAuthUser', userSchema);