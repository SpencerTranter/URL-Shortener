"use strict";
const express = require("express");
const cookieParser = require("cookie-parser");
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;


//Middleware
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use('/assets',express.static(__dirname + '/views/assets'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));


//Getting started
MongoClient.connect(MONGODB_URI, (err, db) => {

  if (err) {
    console.log('Could not connect! Unexpected error. Details below.');
    throw err;
  }

  require("./routes.js")(app, db);

    app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });

});