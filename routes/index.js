const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

// Home Page
router.get('/', indexController.renderHome);

// All items
router.get('/all-stocks', indexController.displayAllItems);

module.exports = router;
