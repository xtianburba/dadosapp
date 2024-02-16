// recipeController.js

const createPool = require('../models/database');
const createCategoryTable = require('../models/Category');

// Create a connection pool
const pool = createPool();

/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {
    res.render('index', { title: 'Cooking Blog - Home' });
};

// Function to create categories
const createCategories = () => {
    // List of categories to insert
    const categoriesToInsert = [
        { "name": "Thai", "image": "thai-food.jpg" },
        { "name": "American", "image": "american-food.jpg" },
        { "name": "Chinese", "image": "chinese-food.jpg" },
        { "name": "Mexican", "image": "mexican-food.jpg" },
        { "name": "Indian", "image": "indian-food.jpg" },
        { "name": "Spanish", "image": "spanish-food.jpg" }
    ];

    // Loop through the categories and insert them into the 'categories' table
    categoriesToInsert.forEach(category => {
        const insertCategoryQuery = 'INSERT INTO categories (name, image) VALUES (?, ?)';
        const { name, image } = category;

        pool.query(insertCategoryQuery, [name, image], (err, results) => {
            if (err) {
                console.error('Error creating category:', err);
            } else {
                console.log('Category created successfully');
            }
        });
    });
};

module.exports = { createCategories, createCategoryTable };
