"use strict";

const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");


console.log(
  "trying to connect to db... in MongoConn.js " + process.env.NODE_ENV
);
console.log(process.env.PORT);


// if (process.env.NODE_ENV && process.env.NODE_ENV != 'dev')
//   var url = `mongodb://${process.env.db_user}:${encodeURIComponent(process.env.db_password)}@${process.env.db_ip}:${process.env.db_port}/${process.env.db_name}`;
// else 
var url = process.env.db_url;

console.log(url);

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var mongoConn = mongoose.connection;

mongoConn.on("error", console.error.bind(console, "Connection error: "));
mongoConn.once("open", function (callback) {
  console.log("Successfully connected to MongoDB /.");
});

autoIncrement.initialize(mongoConn);

module.exports = mongoConn;
