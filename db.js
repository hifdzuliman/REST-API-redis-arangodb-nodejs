var  arangojs = require('arangojs'),
  db = new arangojs.Database({ // Database connection
    url:  "http://127.0.0.1:8529/"

  }),
  aql = arangojs.aql

// Database selection
db.useDatabase("testing");

// Speficy the database user
db.useBasicAuth("hifdzul", "123");

module.exports = {
  db,
  aql
};