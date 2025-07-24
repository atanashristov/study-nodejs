const db = require('mongoose');

let mongoUrl;
let mongoDbName;

async function connect ({ url, dbName }) {
  mongoUrl = url;
  mongoDbName = dbName;

  try {
    await db.connect(mongoUrl, { dbName: mongoDbName });
  } catch (err) {
    setTimeout(connect, 8000);
  }
}

const dbConnection = db.connection;

function disconnect () {
  dbConnection.removeAllListeners();
  return db.disconnect();
}

module.exports = {
  connect,
  disconnect,
};
