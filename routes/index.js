const express = require("express");
const router = express.Router();

const MyMongoLib = require("../MyMongoLib.js");

const myMongoLib = MyMongoLib();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/data", (req, res) => {
  myMongoLib
    .getDocs()
    .then(doc => res.send(doc))
    .catch(err => res.send({ err: true, msg: err }));
});
router.get("/message", (req, res) => {
  console.log("Entro al Message");
  myMongoLib
    .getMessages("5dbe1c169602c70c29dbf384")
    .then(docs => res.send(docs))
    .catch(err => res.send({ err: true, msg: err }));
});
module.exports = router;
