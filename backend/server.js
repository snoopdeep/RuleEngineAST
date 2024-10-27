// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const ruleRoutes = require('./routes/ruleRoutes');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
}));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', ruleRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Rule Engine API is running');
});

console.log(process.env.MONGO_URI)
// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

  // Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  res.status(400).json({ error: err.message });
});