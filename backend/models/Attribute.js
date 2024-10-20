// backend/models/Attribute.js
const mongoose = require('mongoose');

const AttributeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    data_type: { type: String, required: true, enum: ['integer', 'string', 'float', 'boolean'] },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attribute', AttributeSchema);
