const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// ✅ MongoDB connection + insert logic
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log("✅ Database Connected Successfully!!");

    const userSchema = new mongoose.Schema({ name: String });
    const User = mongoose.model("User", userSchema);

    const userExists = await User.findOne({ name: "Ram" });
    if (!userExists) {
        await User.create({ name: "Ram" });
        console.log("✅ Sample user inserted");
    } else {
        console.log("ℹ️ Sample user already exists");
    }

}).catch(err => {
    console.log('❌ Could not connect to the database', err);
    process.exit();
});

// ✅ Basic route
app.get('/', (req, res) => {
    res.json({ "message": "Hello Crud Node Express" });
});

// ✅ User route
const UserRoute = require('./app/routes/User');
app.use('/user', UserRoute);

// ✅ Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Server is listening on port ${port}`);
});
