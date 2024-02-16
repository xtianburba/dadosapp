// app.js

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const createCategoryTable = require('./server/models/Category');
const { createCategories } = require('./server/controllers/recipeController');

const app = express();
const port = 3000;

require('dotenv').config();

// Assuming you have a function to create a connection pool
const createPool = require('./server/models/database');
const pool = createPool();

// Create the 'categories' table if not exists
createCategoryTable(pool);

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(expressLayouts);

app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');

const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);

createCategories();

app.listen(port, () => console.log(`Listening to port ${port}`));