const Item = require('../models/item');
const Category = require('../models/category');

const async = require('async');
const { isValidObjectId } = require('mongoose');
const { body, validationResult, check } = require('express-validator');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
  Category.find({}, 'name').exec(function (err, categories) {
    if (err) {
      return next(err);
    }

    res.render('itemForm', {
      title: 'Create Item',
      categories: categories,
    });
  });
};
exports.createPost = [
  upload.single('photo'),
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') {
        req.body.category = [];
      } else {
        req.body.category = new Array(req.body.category);
      }
    }
    next();
  },
  body('name')
    .trim()
    .escape()
    .isLength({ min: 1, max: 50 })
    .withMessage('Length must be 1-50 characters.'),
  body('description')
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage('Description must be specified.')
    .isLength({ max: 350 })
    .withMessage('Max of 350 characters.'),
  body('numberInStock')
    .toInt()
    .escape()
    .isNumeric()
    .withMessage('Only numbers')
    .isInt({ min: 0, max: 999 })
    .withMessage('Must be within 0-999 units'),
  body('price')
    .toFloat()
    .escape()
    .isNumeric()
    .withMessage('Only numbers')
    .isFloat({ min: 0, max: 1000000 })
    .withMessage('Price must be in 0-1000000 range'),
  body('category.*').escape(),
  check('photo').custom((value, { req }) => {
    if (!req.file) {
      return true;
    }
    if (req.file.size > 5242880) {
      throw new Error('Maximum of 5mb size.');
    }
    return true;
  }),
  check('photo').custom((value, { req }) => {
    if (!req.file) {
      return true;
    }

    const isImg = req.file.mimetype.match(/^image/i);
    if (!isImg) {
      throw new Error('Only images');
    }

    return true;
  }),
  (req, res, next) => {
    const result = validationResult(req);
    const hasErrors = !result.isEmpty();

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      numberInStock: req.body.numberInStock,
      price: req.body.price,
      category: req.body.category,
    });

    if (req.file) {
      item.img.data = req.file.buffer.toString('base64');
      item.img.contentType = req.file.mimetype;
    }

    if (hasErrors) {
      Category.find({}, 'name', function (err, categories) {
        if (err) {
          return next(err);
        }
        const checkedCategories = categories.map((category) => {
          if (item.category.includes(category._id.toString())) {
            category.checked = true;
            return category;
          }
          return category;
        });

        res.render('itemForm', {
          title: 'Create Item',
          item: item,
          categories: checkedCategories,
          errors: result.errors,
        });
      });
      return;
    }

    item.save(function (err) {
      if (err) {
        return next(err);
      }

      res.redirect(item.url);
    });
  },
];

// update
exports.updateGet = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    res.redirect('/catalog/items');
  }

  async.parallel(
    {
      item: function (cb) {
        Item.findById(req.params.id).exec(cb);
      },
      categories: function (cb) {
        Category.find({}, 'name').exec(cb);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }

      const { item, categories } = results;

      if (!item) {
        return res.redirect('/catalog/items');
      }
      const checkedCategories = categories.map((category) => {
        if (item.category.includes(category._id.toString())) {
          category.checked = true;
          return category;
        }
        return category;
      });

      res.render('itemForm', {
        title: 'Update Item',
        btnText: 'Update',
        item: item,
        categories: checkedCategories,
      });
    }
  );
};
exports.updatePost = [
  upload.single('photo'),
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') {
        req.body.category = [];
      } else {
        req.body.category = new Array(req.body.category);
      }
    }
    next();
  },
  body('name')
    .trim()
    .escape()
    .isLength({ min: 1, max: 50 })
    .withMessage('Length must be 1-50 characters.'),
  body('description')
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage('Description must be specified.')
    .isLength({ max: 350 })
    .withMessage('Max of 350 characters.'),
  body('numberInStock')
    .toInt()
    .escape()
    .isNumeric()
    .withMessage('Only numbers')
    .isInt({ min: 0, max: 999 })
    .withMessage('Must be within 0-999 units'),
  body('price')
    .toFloat()
    .escape()
    .isNumeric()
    .withMessage('Only numbers')
    .isFloat({ min: 0, max: 1000000 })
    .withMessage('Price must be in 0-1000000 range'),
  body('category.*').escape(),
  check('photo').custom((value, { req }) => {
    if (!req.file) {
      return true;
    }
    if (req.file.size > 5242880) {
      throw new Error('Maximum of 5mb size.');
    }
    return true;
  }),
  check('photo').custom((value, { req }) => {
    if (!req.file) {
      return true;
    }

    const isImg = req.file.mimetype.match(/^image/i);
    if (!isImg) {
      throw new Error('Only images');
    }

    return true;
  }),
  (req, res, next) => {
    const result = validationResult(req);
    const hasErrors = !result.isEmpty();

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      numberInStock: req.body.numberInStock,
      price: req.body.price,
      category: req.body.category,
      _id: req.params.id,
    });

    if (req.file) {
      item.img.data = req.file.buffer.toString('base64');
      item.img.contentType = req.file.mimetype;
    }

    if (hasErrors) {
      Category.find({}, 'name', function (err, categories) {
        if (err) {
          return next(err);
        }
        const checkedCategories = categories.map((category) => {
          if (item.category.includes(category._id.toString())) {
            category.checked = true;
            return category;
          }
          return category;
        });

        res.render('itemForm', {
          title: 'Update Item',
          btnText: 'Update',
          item: item,
          categories: checkedCategories,
          errors: result.errors,
        });
      });
      return;
    }

    Item.findByIdAndUpdate(req.params.id, item, function (err, updatedItem) {
      if (err) {
        return next(err);
      }

      res.redirect(updatedItem.url);
    });
  },
];

// delete
exports.deleteGet = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.redirect('/catalog/items');
  }

  Item.findById(req.params.id)
    .populate('category', 'name')
    .exec(function (err, item) {
      if (err) {
        return next(err);
      }
      if (!item) {
        return res.redirect('/catalog/items');
      }

      res.render('itemDelete', {
        item: item,
      });
    });
};
exports.deletePost = (req, res, next) => {
  Item.findByIdAndDelete(req.body.itemId, function (err) {
    if (err) {
      return next(err);
    }

    res.redirect('/catalog/items');
  });
};
