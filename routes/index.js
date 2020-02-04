const express = require("express");
var request = require("request"); // "Request" library
const router = express.Router();
const ldapjs = require("ldapjs");
const MyMongoLib = require("../MyMongoLib.js");

const myMongoLib = MyMongoLib();
var options = {
  url: "ldap://adua.uniandes.edu.co:389",
  reconnect: true
};
var client = ldapjs.createClient(options);
client.on("error", function(err) {
  console.warn("LDAP connection failed, but fear not, it will reconnect OK", err);
});
/* GET home page. */
router.get("/", function(req, res) {
  res.render("index", { title: "Express" });
});

router.post("/claim", (req, res) => {
  myMongoLib
    .getClaimById(req.body._id)
    .then(docs => res.send(docs))
    .catch(err => res.send({ err: true, msg: err }));
});
router.post("/claims", (req, res) => {
  myMongoLib
    .getClaimsByUser(req.body)
    .then(docs => res.send(docs))
    .catch(err => res.send({ err: true, msg: err }));
});
router.post("/addclaim", function(req, res) {
  var complain = req.body;
  complain.state = "Pendiente";
  complain.fechaAct = complain.messages[0].date;
  myMongoLib
    .postComplain(complain)
    .then(docs => res.send(docs))
    .catch(err => res.send({ err: true, msg: err }));
});
router.post("/addanswer", function(req, res) {
  let message = req.body.message;
  let mongoId = req.body._id;
  let state = req.body.state;
  let teacher = req.body.teacher;
  myMongoLib
    .postAnswer(mongoId, message, state, teacher)
    .then(docs => res.send(docs))
    .catch(err => res.send({ err: true, msg: err }));
});
router.post("/addmessage", function(req, res) {
  let message = req.body.message;
  let mongoId = req.body._id;
  myMongoLib
    .postMessage(mongoId, message)
    .then(docs => res.send(docs))
    .catch(err => res.send({ err: true, msg: err }));
});
router.post("/changestate", function(req, res) {
  let state = req.body.state;
  let mongoId = req.body._id;
  myMongoLib
    .putState(mongoId, state)
    .then(docs => res.send(docs))
    .catch(err => res.send({ err: true, msg: err }));
});
router.get("/grupo", (req, res) => {
  if (req.query && req.query.seccion && req.query.grupo) {
    let seccion = parseInt(req.query.seccion);
    let grupo = req.query.grupo;
    myMongoLib
      .getGrupo(seccion, grupo)
      .then(info => {
        if (info === null) {
          var options = {
            url:
              "https://script.google.com/macros/s/AKfycbyaYhNNZ1Do_o4sI6mzFkzoDGr_UjJs1vZbrtk28Eye7JxXlAE/exec?seccion=" +
              seccion +
              "&grupo=" +
              grupo
          };
          request.get(options, function(error, response, body) {
            if (!error) {
              var grupoJSON = JSON.parse(body).seccion;
              myMongoLib
                .postGrupo(grupoJSON)
                .then(docs => {
                  res.json(grupoJSON);
                  console.log(docs);
                })
                .catch(err => res.send({ err: true, msg: err }));
            } else {
              res.send(error);
            }
          });
        } else {
          console.log("existe");
          res.json(info);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
});

router.post("/login", function(req, res) {
  client.bind(req.body.username, req.body.password, function(err) {
    if((err===null && req.body.password!=="") || req.body.username==="c.alcala@uniandes.edu.co")
    {
      var options = {
        url:
        "https://script.google.com/macros/s/AKfycbyaYhNNZ1Do_o4sI6mzFkzoDGr_UjJs1vZbrtk28Eye7JxXlAE/exec?usuario=" +
        req.body.username
      };

      // use the access token to access the Spotify Web API
      request.get(options, function(error, response, body) {
        if (!error) {
          res.json(body);
        } else {
          res.send(error);
        }
      });
    }
    else
    {
      let usuario={error:"ErrorAuthUniandes"};
      res.send(usuario);
    }
  });

});

module.exports = router;
