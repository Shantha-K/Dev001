require('dotenv').config(); // Load .env variables
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
console.log('Connecting to MongoDB at:', mongoURI);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log(" Database Connected Successfully!!");
  })
  .catch(err => {
    console.error(' Could not connect to the database:', err.message);
    process.exit(1);
  });

// Default root route
app.get('/', (req, res) => {
  res.json({ message: "Hello Crud Node Express" });
});

// CPU Load Route for Autoscaling Test
app.get('/cpu', (req, res) => {
  const end = Date.now() + 5000; // 5 seconds of CPU work
  while (Date.now() < end) {
    Math.sqrt(Math.random() * 1000); // some CPU-intensive calculations
  }
  res.send(" Heavy CPU load generated!");
});

// User routes
const UserRoute = require('./app/routes/User');
app.use('/user', UserRoute);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(` Server is listening on port ${port}`);
});
