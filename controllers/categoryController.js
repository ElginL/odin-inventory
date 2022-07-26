const Category = require('../models/Category');
const Item = require('../models/Item');
const { body, validationResult } = require('express-validator');
const async = require('async');

exports.displayAllCategories = (req, res, next) => {
    Category.find()
        .exec((err, results) => {
            if (err) {
                return next(err);
            }
            
            res.render('categories', {
                categories: results
            })
        })
}

exports.displayCategoryItems = (req, res, next) => {
    const category = req.params.category;

    Item.find()
        .sort([[ 'name', 1 ]])
        .populate('category')
        .exec((err, results) => {
            if (err) {
                return next(err);
            }

            res.render('categoryItems', {
                category,
                items: results.filter(result => result.category.name === category)
            });
        });
}

exports.displayAddItemForm = (req, res) => {
    const category = req.params.category;
    
    res.render('addItemForm', {
        category,
    });
}

exports.handleAddItemForm = [
    body('name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Name cannot be empty or only have white spaces"),
    body('description')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Description cannot be empty or only have white spaces"),
    (req, res, next) => {
        const category = req.params.category;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('addItemForm', {
                category,
                errors: errors.array(),
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                stockLeft: req.body.stockLeft
            });

            return;
        }

        Category.findOne({ name: category }, '_id')
            .exec((err, results) => {
                if (err) {
                    return next(err);
                }

                const newItem = new Item({
                    name: req.body.name,
                    description: req.body.description,
                    category: results,
                    price: req.body.price,
                    stockCount: req.body.stockCount,
                    imgFilename: req.file ? req.file.filename : ""
                });

                newItem.save(err => {
                    if (err) {
                        next(err);
                    }
                    
                    res.redirect(`/categories/${category}`);
                })
            })

    }
]

exports.displaySingleItem = (req, res, next) => {
    const id = req.params.id;

    Item.findById(id)
        .populate('category')
        .exec((err, results) => {
            if (err) {
                next(err);
            }

            res.render('singleItem', {
                item: results,
                id
            })
        });
}

exports.displayUpdateItemForm = (req, res, next) => {
    const id = req.params.id;

    async.parallel({
        item: callback => Item.findById(id).populate('category').exec(callback),
        categories: callback => Category.find().exec(callback),
    }, (err, results) => {
        if (err) {
            return next(err);
        }

        res.render('modifyItemForm', {
            item: results.item,
            allCategories: results.categories,
        });
    });
}

exports.handleUpdateItemForm = [
    body('name')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Name cannot be empty or only have white spaces"),
    body('description')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Description cannot be empty or only have white spaces"),
    body('price', 'Price must be a number')
        .isNumeric()
        .notEmpty()
        .escape(),
    body('stockCount', 'Stock must be a number')
        .isNumeric()
        .notEmpty()
        .escape(),
    (req, res, next) => {
        const id = req.params.id;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            Category.find()
                .exec((err, results) => {
                    if (err) {
                        return next(err);
                    }

                    res.render('modifyItemForm', {
                        item: {
                            name: req.body.name,
                            description: req.body.description,
                            category: req.body.category,
                            price: req.body.price,
                            stockCount: req.body.stockCount,
                        },
                        allCategories: results,
                        errors: errors.array()
                    })
                });
            return;
        }

        Category.findOne({ name: req.body.category }, '_id')
            .exec((err, results) => {
                if (err) {
                    return next(err);
                }

                if (req.file) {
                    Item.updateOne({ "_id": id }, {
                        name: req.body.name,
                        description: req.body.description,
                        category: results._id,
                        price: req.body.price,
                        stockCount: req.body.stockCount,
                        imgFilename: req.file.filename
                    }, err => {
                        if (err) {
                            return next(err);
                        }
                    })
                } else {
                    Item.updateOne({ "_id": id }, {
                        name: req.body.name,
                        description: req.body.description,
                        category: results._id,
                        price: req.body.price,
                        stockCount: req.body.stockCount,
                    }, err => {
                        if (err) {
                            return next(err);
                        }
                    })
                }

                if (req.params.category !== "undefined")  {
                    res.redirect(`/categories/${req.params.category}`);
                } else {
                    res.redirect('/all-stocks');
                }
            })
    }
]

exports.handleDeleteItem = (req, res, next) => {
    const id = req.params.id;
    Item.deleteOne({ _id: id }, err => {
        if (err) {
            return next(err);
        }

        res.redirect(`/categories/${req.params.category}`);
    })
}