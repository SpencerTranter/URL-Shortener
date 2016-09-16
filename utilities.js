"use strict";

module.exports = {

  getLongURL: function(db, shortURL, cb) {
    let query = { "shortURL": shortURL };
    db.findOne(query, (err, result) => {
      if (err) {
        return cb(err);
      }
      return cb(null, result.longURL);
    });
  },

  generateRandomString: function() {
   let s = Math.random().toString(36).slice(2);
   return s.substr(0, 6);
  }

};