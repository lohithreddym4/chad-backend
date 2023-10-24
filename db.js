const mongoose=require('mongoose')
require('dotenv').config();
const mongoURI=`${process.env.dbHost}://${process.env.dbUser}:${process.env.dbPassword}@chad.07aqhan.mongodb.net/`
const connectToMongo = async () => {
    await mongoose
      .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log("connected to DB!");
      })
      .catch((error) => console.log(error));
  };
  
  module.exports = connectToMongo;