const Database = require('./database');
const config = require('./dbconnection');
const data = require('./dummyData');

const db = new Database(config);

const initialise = async () => {
  await db.initDatabase(data);
  process.exit();
}

initialise();