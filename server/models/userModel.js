const db = require('../db');

const createUserTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      firstname VARCHAR(255) NOT NULL,
      lastname VARCHAR(255) NOT NULL,
      mobile VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  return db.promise().query(createTableQuery);
};


const findUserByEmail = (email) => {
  const selectQuery = 'SELECT * FROM users WHERE email = ?';
  
  return db.promise().query(selectQuery, [email]);
};

const findUserByMobile = (mobile) => {
  const selectQuery = 'SELECT * FROM users WHERE mobile = ?';
  
  return db.promise().query(selectQuery, [mobile]);
};


module.exports = {
  createUserTable,
  findUserByEmail,
  findUserByMobile,
};