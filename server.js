const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const connectToDB = require('./db');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const UserRoute = require('./app/routes/User')
app.use('/user',UserRoute)

app.get('/', (req, res) => {
    res.json({"message": "Hello Crud Node Express"});
});
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
connectToDB()
  .then((db) => {
    app.locals.db = db;  // optional: store db reference for routes

    // Example middleware
    app.use(express.json());

    // Example route
    app.get('/api/health', (req, res) => {
      res.send(' Server is healthy and connected to DB!');
    });

    // Start server
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' Failed to connect to MongoDB:', err);
  });



