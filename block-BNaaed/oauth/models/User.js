const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: { type: String },
  username: { type: String, required: true, unique: true },
  photo: { type: String },
}, { timestamp: true });

module.exports = mongoose.model('User', userSchema);
