const express = require("express");

const router = express.Router();

const MyMongoLib = require("../MyMongoLib.js");

const myMongoLib = MyMongoLib();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});
//Ejemplo de John Borrar cuando este listo
router.get("/data", (req, res) => {
  myMongoLib
    .getDocs()
    .then(doc => res.send(doc))
    .catch(err => res.send({ err: true, msg: err }));
});
router.post("/claim", (req, res) => {
  myMongoLib
    .getClaimById(req.body._id)
    .then(docs => res.send(docs))
    .catch(err => res.send({ err: true, msg: err }));
});
router.post("/claims", (req, res) => {
  myMongoLib
    .getClaimsByUser(req.body.type, req.body.user)
    .then(docs => res.send(docs))
    .catch(err => res.send({ err: true, msg: err }));
});
router.post("/addclaim", function(req, res) {
  var complain = req.body;
  complain.state = "Pendiente";
  myMongoLib
    .postComplain(complain)
    .then(docs => res.send(docs))
    .catch(err => res.send({ err: true, msg: err }));
});
router.post("/addanswer", function(req, res) {
  let answer = req.body.answer;
  let mongoId = req.body._id;
  let state = req.body.state;
  let teacher = req.body.teacher;
  myMongoLib
    .postAnswer(mongoId, answer, state, teacher)
    .then(docs => res.send(docs))
    .catch(err => res.send({ err: true, msg: err }));
});
module.exports = router;
