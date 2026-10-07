const express = require('express');
const { getCurrentUser, getUsers } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', authMiddleware, getCurrentUser);
router.get('/', authMiddleware, getUsers);

module.exports = router;
