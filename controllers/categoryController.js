const Category = require('../models/category');
const Item = require('../models/item');

const async = require('async');
const { isValidObjectId } = require('mongoose');

exports.index = (req, res, next) => {
  Category.find({}, 'name', (err, categoryList) => {
    if (err) {
      return next(err);
    }

    res.render('index', { title: 'Categories', categoryList: categoryList });
  });
};

// Category items list
exports.categoryItems = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.redirect('/catalog');
  }

  async.parallel(
    {
      category: function (cb) {
        Category.findById(req.params.id).exec(cb);
      },
      categoryItems: function (cb) {
        Item.find({ category: req.params.id }).exec(cb);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      const { category, categoryItems } = results;
      if (!category) {
        return res.redirect('/catalog');
      }

      res.render('categoryItems', {
        category: category,
        categoryItems: categoryItems,
      });
    }
  );
};

// Create
exports.createGet = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};
exports.createPost = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};

// Update
exports.updateGet = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};
exports.updatePost = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};

// Delete
exports.deleteGet = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};
exports.deletePost = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};
