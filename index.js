var express = require("express");
var methodOverride = require('method-override');
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
app.set("view engine", "ejs");
//Used with npm install body-parser to allow us access to POST request paramaters
app.use(methodOverride('_method'));//Using a query string value to override the method
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"//,
  //"dkad8a": "https://www.facebook.com/"
};

app.get("/urls", (req, res) => {
  "use strict";
  let shortener = 'https://goo.gl/';
  let templateVars = {urls: urlDatabase,
                      shortener: shortener};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  "use strict";
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {
  "use strict";
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
  res.render("urls_show", {shortURL: req.params.id});
});


app.post("/urls", (req, res) => {
  "use strict";
  console.log(req.body); //debug statement to see POST params
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
  console.log(urlDatabase);
});

app.delete('/urls/:id', function (req, res) {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.put('/urls/:id', function (req, res) {
  urlDatabase[req.params.id] = req.body.newLongURL;
  console.log(urlDatabase);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


function generateRandomString(){
 "use strict";
 let s = Math.random().toString(36).slice(2);
 return s.substr(0, 6);
}