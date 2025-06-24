const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongoUrl = process.env.MONGO_URI || dbConfig.url;
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => {
  console.error('MongoDB connection failed:', err);
  process.exit();
});

const UserRoute = require('./app/routes/User')
app.use('/user',UserRoute)

app.get('/', (req, res) => {
    res.json({"message": "Hello Crud Node Express"});
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});



