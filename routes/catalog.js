const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const itemController = require('../controllers/itemController');

/* Category */

// Home
router.get('/', categoryController.index);

// Create category
router.get('/category/create', categoryController.createGet);
router.post('/category/create', categoryController.createPost);

// Update category
router.get('/category/:id/update', categoryController.updateGet);
router.post('/category/:id/update', categoryController.updatePost);

// Delete category
router.get('/category/:id/delete', categoryController.deleteGet);
router.post('/category/:id/delete', categoryController.deletePost);

// Category items
router.get('/category/:id', categoryController.categoryItems);

//
/* Item */

// Item list
router.get('/items', itemController.itemList);

// Create item
router.get('/item/create', itemController.createGet);
router.post('/item/create', itemController.createPost);

// Update item
router.get('/item/:id/update', itemController.updateGet);
router.post('/item/:id/update', itemController.updatePost);

// Delete item
router.get('/item/:id/delete', itemController.deleteGet);
router.post('/item/:id/delete', itemController.deletePost);

// Item detail
router.get('/item/:id', itemController.itemDetail);

module.exports = router;
