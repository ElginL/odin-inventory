const Item = require('../models/Item');
const { DateTime } = require("luxon");

exports.renderHome = (req, res, next) => {
    Item.find({}, 'category')
        .populate('category')
        .exec((err, results) => {
            if (err) {
                return next(err);
            }

            const counts = {};

            results.forEach(result => {
                counts[result.category.name]
                    ? counts[result.category.name] = counts[result.category.name] + 1
                    : counts[result.category.name] = 1;
            })

            res.render('index', {
                counts,
                dateNow: DateTime.fromJSDate(new Date()).toLocaleString(DateTime.DATE_MED),
                timeNow: DateTime.fromJSDate(new Date()).toLocaleString(DateTime.TIME_24_SIMPLE)
            })
        })
}

exports.displayAllItems = (req, res, next) => {
    Item.find()
        .exec((err, results) => {
            if (err) {
                return next(err)
            }

            res.render('foodstocks', {
                items: results
            })
        })
}