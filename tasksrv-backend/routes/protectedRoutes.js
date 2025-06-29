// server/routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const protectedController = require('../Controllers/protectedController');
const authMiddleware = require('../Middleware/authMiddleware');

router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: `This is protected data for user id:  ${req.user.id}` });
});
module.exports = router;