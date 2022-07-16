#! /usr/bin/env node

console.log('This script populates some items and categories to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async');
const Item = require('./models/Item');
const Category = require('./models/Category');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const items = []
const categories = []

function createCategory(name, description, cb) {
    const categoryDetail = {
        name,
        description
    };

    const category = new Category(categoryDetail);

    category.save(err => {
        if (err) {
            cb(err, null);
            return;
        }
        console.log("New Category: " + category);
        categories.push(category);
        cb(null, category);
    })
}

function createItem(name, description, category, price, stockCount, cb) {
    const itemDetail = {
        name,
        description,
        category,
        price,
        stockCount
    }

    const item = new Item(itemDetail);

    item.save(err => {
        if (err) {
            cb(err, null);
            return;
        }
        console.log("New item: " + item);
        items.push(item);
        cb(null, item);
    })
}

function createCategories(cb) {
    async.series([
        function(callback) {
          createCategory("Fish", "Creatures From The Sea", callback);
        },
        function(callback) {
          createCategory("Poultry", "Good Meat", callback);
        },
        function(callback) {
          createCategory("Vegetable", "Plants Around You", callback);
        },
        function(callback) {
          createCategory("Fruits", "Sweet and nice", callback);
        },
        function(callback) {
          createCategory("Dairy", "Moo Moooo", callback);
        }
    ],
    // optional callback
    cb);
}


function createItems(cb) {
    async.parallel([
        function(callback) {
            createItem("Codfish", 'Saltwater Fish', categories[0], 8.99, 34, callback);
        },
        function(callback) {
            createItem("Sea Bream", 'Expensive Fish', categories[0], 15, 21, callback);
        },
        function(callback) {
            createItem("Salmon", 'Pink Meat', categories[0], 20, 12, callback);
        },
        function(callback) {
            createItem("Sea Bass", 'Restaurant Fish', categories[0], 5.31, 98, callback);
        },
        function(callback) {
            createItem("Tuna", 'Found in Cans', categories[0], 25, 3, callback);
        },
        function(callback) {
            createItem("Sardine", 'Swims Fast', categories[0], 17, 33, callback);
        },
        function(callback) {
            createItem("Peking Duck", 'China Duck', categories[1], 98, 15, callback);
        },
        function(callback) {
            createItem("Kung Pao Chicken", 'Chinese Cuisine', categories[1], 17, 8, callback);
        },
        function(callback) {
            createItem("Butter Chicken", 'Indian Speciality', categories[1], 22, 2, callback);
        },
        function(callback) {
            createItem("Chicken Nuggets", 'Mac Donald', categories[1], 7.20, 6, callback);
        },
        function(callback) {
            createItem("Fried Chicken", 'KFC', categories[1], 9.30, 2, callback);
        },
        function(callback) {
            createItem("Spinach", 'Vitamin Rich', categories[2], 7.70, 25, callback);
        },
        function(callback) {
            createItem("Carrot", 'Orange Kind', categories[2], 1.70, 100, callback);
        },
        function(callback) {
            createItem("Broccoli", 'Tree Shape', categories[2], 2.20, 48, callback);
        },
        function(callback) {
            createItem("Garlic", 'Garlic Bread', categories[2], 0.70, 79, callback);
        },
        function(callback) {
            createItem("Avocado", 'Most Nutritious Fruit', categories[3], 5.43, 63, callback);
        },
        function(callback) {
            createItem("Apple", 'No Worms', categories[3], 2.20, 43, callback);
        },
        function(callback) {
            createItem("Banana", 'Sweet and Fresh', categories[3], 3.2, 26, callback);
        },
        function(callback) {
            createItem("Yogurt", 'Sour but nice', categories[4], 2.70, 24, callback);
        },
        function(callback) {
            createItem("Milk", 'Eat With Cereal', categories[4], 3.70, 78, callback);
        },
        ],
        // optional callback
        cb);
}


async.series([
    createCategories,
    createItems,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Categories: '+ categories);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});