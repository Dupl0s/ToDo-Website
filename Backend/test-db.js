// test-db.js
require('dotenv').config();
const { Client } = require('pg');


const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

console.log(process.env.DATABASE_URL); // Debugging: Log the connection string
client.connect()
  .then(() => client.query('SELECT NOW()'))
  .then(res => {
    console.log('Verbindung erfolgreich! Zeit:', res.rows[0]);
    return client.end();
  })
  .catch(err => {
    console.error('Verbindung fehlgeschlagen:', err);
  });