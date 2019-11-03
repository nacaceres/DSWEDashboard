const MongoClient = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectID;
const MyMongoLib = function() {
  const MyMongoLib = this || {};
  // Connection URL
  const url = process.env.MONGO_URL || "mongodb://localhost:27017";

  // Database Name
  const dbName = "desarrolloDB";

  // Create a new MongoClient
  const client = new MongoClient(url, { useUnifiedTopology: true });
  let conn = MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  MyMongoLib.getDocs = () =>
    new Promise((resolve, reject) => {
      // Use connect method to connect to the Server
      conn.then(client => {
        const db = client.db(dbName);
        const testCol = db.collection("test");

        testCol
          .find({})
          .limit(20)
          .toArray()
          .then(resolve)
          .catch(reject);
        return testCol;
      });
    });
  MyMongoLib.getClaimById = mongoId =>
    new Promise((resolve, reject) => {
      // Use connect method to connect to the Server
      conn.then(client => {
        let fixId = new ObjectId(mongoId);
        const db = client.db(dbName);
        const messageCol = db.collection("messages");

        messageCol
          .findOne({ _id: fixId })
          .then(resolve)
          .catch(reject);

        return messageCol;
      });
    });
  MyMongoLib.getClaimsByUser = (type, user) =>
    new Promise((resolve, reject) => {
      // Use connect method to connect to the Server
      conn.then(client => {
        const db = client.db(dbName);
        const testCol = db.collection("messages");
        if (type == "student") {
          testCol
            .find({ student: user })
            .limit(20)
            .toArray()
            .then(resolve)
            .catch(reject);
        } else {
          testCol
            .find({})
            .limit(20)
            .toArray()
            .then(resolve)
            .catch(reject);
        }
        return testCol;
      });
    });
  MyMongoLib.postComplain = complain =>
    new Promise((resolve, reject) => {
      // Use connect method to connect to the Server
      conn.then(client => {
        const db = client.db(dbName);
        const messageCol = db.collection("messages");

        messageCol
          .insertOne(complain)
          .then(resolve)
          .catch(reject);

        return messageCol;
      });
    });
  MyMongoLib.postAnswer = (mongoId, answerParam, stateParam, teacherParam) =>
    new Promise((resolve, reject) => {
      // Use connect method to connect to the Server
      conn.then(client => {
        const db = client.db(dbName);
        const messageCol = db.collection("messages");
        let fixId = new ObjectId(mongoId);
        messageCol
          .updateOne(
            { _id: fixId },
            {
              $set: {
                answer: answerParam,
                state: stateParam,
                teacher: teacherParam
              }
            }
          )
          .then(resolve)
          .catch(reject);

        return messageCol;
      });
    });
  MyMongoLib.listenToChanges = cbk => {
    client.connect((err, client) => {
      if (err !== null) {
        throw err;
      }
      console.log("Connected correctly to server");
      const db = client.db(dbName);
      const testCol = db.collection("messages");

      const csCursor = testCol.watch();
      console.log("Listening To Changes on Mongo");
      csCursor.on("change", data => {
        console.log("changed!", data);
        MyMongoLib.getDocs().then(docs => cbk(JSON.stringify(docs)));
      });
    });
  };
  return MyMongoLib;
};
module.exports = MyMongoLib;
