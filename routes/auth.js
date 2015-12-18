var jwt = require("jwt-simple");
var userFunc = require("./../controllers/userMethods");


var getToken = function (validuser) {
  var ndate = new Date();
  var sessionLength = 23;
  ndate = ndate.setHours(ndate.getHours() + sessionLength);
  var token = jwt.encode({
    exp: ndate
  }, require("../config/secret")());
  return {
    token: token,
    expires: ndate,
    user: validuser
  };
};

var validateDB = function (username, password, cb) {
  var query = {
    "username": username,
    "password": password
  };
  userFunc.retrieveData(query).then(function (result) {
    cb(null, result);
  }).catch(function (err) {
    cb(err, null);
  });
};

var auth = {
  login: function (req, res) {
    // fetch login credentials from request body
    var username = req.body.username || "";
    var password = req.body.password || "";
    // check for empty credentials
    if (username === "" || password === "") {
      res.json({
        "status": false,
        "message": "Invalid credentials"
      });
      return;
    } else { // query data API for valid credentials
      validateDB(username, password, function (err, validuser) {
        if (err) {
          res.json(err);
          return;
        }
        if (validuser) {
          res.json(getToken(validuser));
        } else {
          res.json({
            "status": false,
            "message": "Invalid credentials"
          });
        }
      });
    }
  }
};

module.exports = auth;