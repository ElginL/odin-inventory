const mongoose = require('mongoose');
const Category = require('./Category');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        minLength: 3,
        maxLength: 20
    },
    description: { 
        type: String, 
        required: true, 
        minLength: 3, 
        maxLength: 30
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: Category
    },
    price: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    stockCount: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    imgFilename: { type: String }
});

ItemSchema
    .virtual('url')
    .get(function() {
        return "/items" + this._id;
    });

module.exports = mongoose.model('Item', ItemSchema);