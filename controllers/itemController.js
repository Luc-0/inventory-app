const Item = require('../models/item');

const async = require('async');
const { isValidObjectId } = require('mongoose');

exports.itemList = (req, res, next) => {
  Item.find()
    .populate('category', 'name')
    .exec((err, items) => {
      if (err) {
        return next(err);
      }

      res.render('itemList', {
        title: 'Items',
        itemList: items,
      });
    });
};

exports.itemDetail = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.redirect('/catalog/items');
  }

  Item.findById(req.params.id)
    .populate('category', 'name')
    .exec((err, item) => {
      if (err) {
        return next(err);
      }
      if (!item) {
        return res.redirect('/catalog/items');
      }

      res.render('itemDetail', {
        title: item.name,
        item: item,
      });
    });
};

// Create
exports.createGet = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};
exports.createPost = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};

// update
exports.updateGet = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};
exports.updatePost = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};

// delete
exports.deleteGet = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};
exports.deletePost = (req, res, next) => {
  res.end('NOT IMPLEMENTED' + req.path);
};
