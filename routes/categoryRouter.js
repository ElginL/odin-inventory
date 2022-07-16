const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
});

const upload = multer({ storage });

// Display all categories
router.get('/', categoryController.displayAllCategories);

// Display all items from that category
router.get('/:category', categoryController.displayCategoryItems);

// Display add form
router.get('/:category/addItem', categoryController.displayAddItemForm);

// POST request to add item
router.post('/:category/addItem', upload.single('image'), categoryController.handleAddItemForm);

// Display single item
router.get('/:category/:id', categoryController.displaySingleItem);

// Form for updating single item
router.get('/:category/:id/update', categoryController.displayUpdateItemForm);

// Update single item
router.post('/:category/:id/update', upload.single('image'), categoryController.handleUpdateItemForm);

// Delete single item
router.post('/:category/:id/delete', categoryController.handleDeleteItem);

module.exports = router;