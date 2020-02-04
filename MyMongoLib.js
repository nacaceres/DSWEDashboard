const MongoClient = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectID;

const MyMongoLib = function() {
  const MyMongoLib = this || {};
  // Connection URL
  const url = "mongodb+srv://andres:admin123@clustertest-ii7rm.mongodb.net/test?retryWrites=true&w=majority";

  // Database Name
  const dbName = "desarrolloDB";

  // Create a new MongoClient
  const client = new MongoClient(url, { useUnifiedTopology: true });
  let conn = MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  MyMongoLib.getGrupo = (seccion, grupo) =>
    new Promise((resolve, reject) => {
      conn.then(client => {
        const db = client.db(dbName);
        const gruposCol = db.collection("grupos");
        gruposCol
          .findOne({ numero: seccion, "grupo.nombre": grupo })
          .then(resolve)
          .catch(reject);

        return gruposCol;
      });
    });
  MyMongoLib.deleteGrupo = (seccion, grupo) =>
    new Promise((resolve, reject) => {
      conn.then(client => {
        const db = client.db(dbName);
        const gruposCol = db.collection("grupos");
        gruposCol
          .deleteMany({ numero: seccion, "grupo.nombre": grupo })
          .then(resolve)
          .catch(reject);
        return gruposCol;
      });
    });
  MyMongoLib.postGrupo = grupo =>
    new Promise((resolve, reject) => {
      // Use connect method to connect to the Server
      conn.then(client => {
        const db = client.db(dbName);
        const gruposCol = db.collection("grupos");
        gruposCol
          .insertOne(grupo)
          .then(resolve)
          .catch(reject);
        return gruposCol;
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
  MyMongoLib.getClaimsByUser = user =>
    new Promise((resolve, reject) => {
      // Use connect method to connect to the Server
      conn.then(client => {
        const db = client.db(dbName);
        const testCol = db.collection("messages");
        console.log(user.rol);
        if (user.rol === "PROFESOR" || user.rol === "MONITOR") {
          let secciones = [];
          let i;
          for (i in user.secciones) {
            secciones.push(user.secciones[i].numero);
          }
          console.log(secciones);
          testCol
            .find({ section: { $in: secciones } })
            .toArray()
            .then(resolve)
            .catch(reject);
        } else {
          testCol
            .find({ student: user.correo })
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
  MyMongoLib.postAnswer = (mongoId, messageParam, stateParam, teacherParam) =>
    new Promise((resolve, reject) => {
      // Use connect method to connect to the Server
      conn.then(client => {
        const db = client.db(dbName);
        const messageCol = db.collection("messages");
        let fixId = new ObjectId(mongoId);
        let fechaActParam = messageParam.date;
        messageCol
          .updateOne(
            { _id: fixId },
            {
              $set: {
                state: stateParam,
                teacher: teacherParam,
                fechaAct: fechaActParam
              },
              $push: {
                messages: messageParam
              }
            }
          )
          .then(resolve)
          .catch(reject);

        return messageCol;
      });
    });
  MyMongoLib.postMessage = (mongoId, messageParam) =>
    new Promise((resolve, reject) => {
      // Use connect method to connect to the Server
      conn.then(client => {
        const db = client.db(dbName);
        const messageCol = db.collection("messages");
        let fixId = new ObjectId(mongoId);
        let fechaActParam = messageParam.date;
        messageCol
          .updateOne(
            { _id: fixId },
            {
              $set: {
                fechaAct: fechaActParam
              },
              $push: {
                messages: messageParam
              }
            }
          )
          .then(resolve)
          .catch(reject);

        return messageCol;
      });
    });
  MyMongoLib.putState = (mongoId, stateParam) =>
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
                state: stateParam
              }
            }
          )
          .then(resolve)
          .catch(reject);

        return messageCol;
      });
    });
  MyMongoLib.listenToChanges = (cbk, inicial) => {
    client.connect((err, client) => {
      if (err !== null) {
        throw err;
      }
      console.log("Connected correctly to server");
      const db = client.db(dbName);
      const testCol = db.collection("messages");

      const csCursor = testCol.watch();
      console.log("Listening To Changes on Mongo");
      inicial();
      csCursor.on("change", data => {
        //console.log("Cambios", data);
        console.log("Document changed: ", data.documentKey._id);
        MyMongoLib.getClaimById(data.documentKey._id).then(docs =>
          cbk(JSON.stringify(docs))
        );
      });
    });
  };
  MyMongoLib.autoUpdate = hrs => {
    console.log("STARTED", hrs);
  };

  return MyMongoLib;
};
module.exports = MyMongoLib;
