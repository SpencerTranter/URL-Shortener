const express = require("express");
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = "mongodb://127.0.0.1:27017/url_shortener";
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use('/assets',express.static(__dirname + '/views/assets'));
app.use(bodyParser.urlencoded({
  extended: true
}));

MongoClient.connect(MONGODB_URI, (err, db) => {
  "use strict";

  if (err) {
    console.log('Could not connect! Unexpected error. Details below.');
    throw err;
  }

  console.log('Connected to the database!');
  let collection = db.collection("urls");

  var urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
  };

  app.get("/urls", (req, res) => {
    "use strict";
    let shortener = 'https://goo.gl/';
    collection.find().toArray((err, results) => {
      if (err){
        console.log(err);
        return false;
      }
      console.log('results: ', results);
      let templateVars = {
        urls: results,
        shortener: shortener
      }
       res.render("urls_index", templateVars);
    });
  });


  app.get("/urls/new", (req, res) => {
    "use strict";
    res.render("urls_new");
  });

  app.get("/u/:shortURL", (req, res) => {
    "use strict";
    let shortURL = req.params.shortURL;
    getLongURL(collection, shortURL, (err, longURL) => {
      res.redirect(longURL);
    });
  });

  app.get("/urls/:id", (req, res) => {
    "use strict";
    let shortURL = req.params.id
    getLongURL(collection, shortURL, (err, longURL) => {
      let templateVars = {
        shortURL: shortURL,
        longURL: longURL
      };
    res.render("urls_show", templateVars);
    });
  });

  app.post("/urls", (req, res) => {
    "use strict";
    let shortURL = generateRandomString();
    let longURL = req.body.longURL;
    collection.insertOne({
      "shortURL": shortURL,
      "longURL": longURL});
    res.redirect(`/urls/${shortURL}`);
  });

  app.delete('/urls/:id', function (req, res) {
    let query = { "shortURL": req.params.id };
    collection.remove(query);
    res.redirect("/urls");
  });

  app.put('/urls/:id', function (req, res) {
    let shortURL = req.params.id;
    getLongURL(collection, shortURL, (err, longURL) => {
      if (errr){
        console.log(err);
        return false;
      }
      collection.update(
        {"shortURL": shortURL, "longURL": longURL},
        {"shortURL": shortURL, "longURL": req.body.newLongURL});
      res.redirect("/urls");
    });
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });

});

function getLongURL(db, shortURL, cb) {
  "use strict";
  let query = { "shortURL": shortURL };
  db.findOne(query, (err, result) => {
    if (err) {
      return cb(err);
    }
    return cb(null, result.longURL);
  });
}

function generateRandomString(){
 "use strict";
 let s = Math.random().toString(36).slice(2);
 return s.substr(0, 6);
}