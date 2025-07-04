const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dbConfig = require('./config/database.config.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ Database Connected Successfully!");
}).catch(err => {
    console.error("❌ Could not connect to MongoDB:", err.message);
    process.exit();
});

app.get('/', (req, res) => {
    res.json({ message: "Hello Crud Node Express" });
});

const UserRoute = require('./app/routes/User');
app.use('/user', UserRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Server is listening on port ${port}`);
});
