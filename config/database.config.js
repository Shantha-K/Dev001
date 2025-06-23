module.exports = {
    url: 'mongodb://localhost:27017/crud-node-express'
}
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connectToDB() {
  await client.connect();
  console.log("Connected to MongoDB Atlas");
  return client.db();
}

module.exports = connectToDB;