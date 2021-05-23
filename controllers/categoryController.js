const Category = require('../models/category');
const Item = require('../models/item');

const async = require('async');
const { isValidObjectId } = require('mongoose');
const { body, validationResult } = require('express-validator');

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
  res.render('categoryForm', {
    title: 'Create Category',
    btnText: 'Create Category',
  });
};
exports.createPost = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name must be specified')
    .isLength({ max: 50 })
    .withMessage('Name needs to be at maximum 50 characters long.'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Description must bee specified')
    .isLength({ max: 350 })
    .withMessage('Max of 350 characters long.'),
  function (req, res, next) {
    const errorsResult = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errorsResult.isEmpty()) {
      res.render('categoryForm', {
        title: 'Create Category',
        category: category,
        errors: errorsResult.errors,
      });
      return;
    }

    Category.find({ name: category.name }).exec(function (err, foundCategory) {
      if (err) {
        return next(err);
      }

      if (foundCategory.length > 0) {
        res.redirect(foundCategory[0].url);
        return;
      }

      category.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect(category.url);
      });
    });
  },
];
// Update
exports.updateGet = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.redirect('/catalog');
  }

  Category.findById(req.params.id, function (err, category) {
    if (err) {
      return next(err);
    }
    if (!category) {
      return res.redirect('/catalog');
    }

    res.render('categoryForm', {
      title: 'Update Category',
      btnText: 'Update',
      category: category,
    });
  });
};
exports.updatePost = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name must be specified')
    .isLength({ max: 50 })
    .withMessage('Name needs to be at maximum 50 characters long.'),
  body('description')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Description must bee specified')
    .isLength({ max: 350 })
    .withMessage('Max of 350 characters long.'),
  (req, res, next) => {
    const result = validationResult(req);
    const hasError = !result.isEmpty();

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (hasError) {
      res.render('categoryForm', {
        title: 'Update Category',
        btnText: 'Update',
        category: category,
        errors: result.errors,
      });
      return;
    }

    Category.findByIdAndUpdate(
      req.params.id,
      category,
      function (err, updatedCategory) {
        if (err) {
          return next(err);
        }

        res.redirect(updatedCategory.url);
      }
    );
  },
];

// Delete
exports.deleteGet = (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    res.redirect('/catalog');
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

      res.render('categoryDelete', {
        category: category,
        categoryItems: categoryItems,
      });
    }
  );
};
exports.deletePost = (req, res, next) => {
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

      if (categoryItems.length > 0) {
        res.render('categoryDelete', {
          category: category,
          categoryItems: categoryItems,
        });
        return;
      } else {
        Category.findByIdAndDelete(req.body.categoryId, function (err) {
          if (err) {
            return next(err);
          }
          res.redirect('/catalog');
        });
      }
    }
  );
};
