const express = require('express');
const verifyToken = require('../utils/verifyToken');
const { createCategory, categoryListView, categoryDelete, categoryUpdateView, updateCategory } = require('../controllers/CategoryController');

const router = express.Router();

router.get('/category', verifyToken(['admin', 'user']), categoryListView)
router.post('/create-category', verifyToken(['admin', 'user']), createCategory)
router.post('/category-delete', verifyToken(['admin', 'user']), categoryDelete)
router.get('/edit-category/:categoryId', verifyToken(['admin', 'user']), categoryUpdateView)
router.put('/update-category/:categoryId', verifyToken(['admin', 'user']), updateCategory)

module.exports = router;