// database.js

const mysql = require('mysql2/promise');

// Function to create and return a connection pool
function createPool() {
  const pool = mysql.createPool({
    host: '154.49.245.52',
    user: 'u982122037_mimateriaprima',
    password: '#j![R#Xe5oU',
    database: 'u982122037_mimateriaprima',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

   // Return the promise pool
   return pool;
}

module.exports = createPool;



