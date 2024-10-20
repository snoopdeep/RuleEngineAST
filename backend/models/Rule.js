// backend/models/Rule.js
const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    ast: { type: Object, required: true }, // Stored as JSON
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rule', RuleSchema);
