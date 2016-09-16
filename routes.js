"use strict";
const express = require("express");
const methodOverride = require('method-override');
const app = express();
const utilities = require("./utilities.js");

//Middleware
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use('/assets',express.static(__dirname + '/views/assets'));

module.exports = function(app, db) {

  console.log('Connected to the database!');
  let collection = db.collection("urls");

  app.get("/urls", (req, res) => {
    collection.find().toArray((err, results) => {
      if (err) {
        console.log(err);
        return false;
      }
      let templateVars = {
        urls: results,
      }
       res.render("urls_index", templateVars);
    });
  });


  app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });

  app.get("/u/:shortURL", (req, res) => {
    let shortURL = req.params.shortURL;
    utilities.getLongURL(collection, shortURL, (err, longURL) => {
      res.redirect(longURL);
    });
  });

  app.get("/urls/:id", (req, res) => {
    let shortURL = req.params.id
    utilities.getLongURL(collection, shortURL, (err, longURL) => {
      let templateVars = {
        shortURL: shortURL,
        longURL: longURL
      };
    res.render("urls_show", templateVars);
    });
  });

  app.post("/urls", (req, res) => {
    let shortURL = utilities.generateRandomString();
    let longURL = req.body.longURL;
    collection.insertOne ({
      "shortURL": shortURL,
      "longURL": longURL });
    res.redirect(`/urls/${shortURL}`);
  });

  app.delete('/urls/:id', function (req, res) {
    let query = { "shortURL": req.params.id };
    collection.remove(query);
    res.redirect("/urls");
  });

  app.put('/urls/:id', function (req, res) {
    let shortURL = req.params.id;
    utilities.getLongURL(collection, shortURL, (err, longURL) => {
      if (err) {
        console.log(err);
        return false;
      }
      collection.update(
        {"shortURL": shortURL, "longURL": longURL},
        {"shortURL": shortURL, "longURL": req.body.newLongURL});
      res.redirect("/urls");
    });
  });

}