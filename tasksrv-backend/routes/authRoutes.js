const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.post('/register', authController.register);



// Add this to authRoutes.js for now (for testing)
// router.post('/register', async (req, res) => {
//   const { email, password } = req.body;
//   const user = new User({ email, password });
//   await user.save();
//   res.status(201).json({ message: 'User created' });
// });


module.exports = router;

