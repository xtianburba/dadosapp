// Category.js
const createCategoryTable = async (pool) => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        image VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
  
    // Use async/await to handle the promise returned by pool.query
    try {
      const [results] = await pool.query(createTableQuery);
      console.log('Table created or already exists');
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

 
  
  module.exports = createCategoryTable;





