const jwt = require('jsonwebtoken');
const User = require('../Models/user');
const Token = require('../Models/Token');

// Generate Access Token (valid 15 mins)
const generateAccessToken = (userId, duration = '15s') => {
  return jwt.sign({ id: userId }, process.env.ACCESS_SECRET, { expiresIn: duration });
};
const generateRefreshToken = (userId, duration = '20s') => {
  return jwt.sign({ id: userId }, process.env.REFRESH_SECRET, { expiresIn: duration });
};


exports.refreshToken = async (req, res) => {
  const oldToken = req.cookies.refreshToken;
  if (!oldToken) return res.sendStatus(401);

  const stored = await Token.findOne({ token: oldToken });
  if (!stored) return res.sendStatus(403);

  try {
    const payload = jwt.verify(oldToken, process.env.REFRESH_SECRET);

    // Invalidate old refresh token
    await Token.deleteOne({ token: oldToken });

    // ✅ Issue new access token for 20 seconds
    const newAccessToken = generateAccessToken(payload.id, '20s');
    const newRefreshToken = generateRefreshToken(payload.id);

    // Save new refresh token
    await Token.create({ userId: payload.id, token: newRefreshToken });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: true, // for HTTPS
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.sendStatus(403);
  }
};


// Register User
exports.register = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) return res.status(409).json({ error: 'User already exists' });

  const newUser = new User({ email, password });
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully' });
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  await Token.create({ userId: user._id, token: refreshToken });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true, // Set to true in production (HTTPS)
  });

  res.json({ accessToken });
  
};

// Refresh Access Token
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  const stored = await Token.findOne({ token: refreshToken });
  if (!stored) return res.sendStatus(403);

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    await Token.deleteOne({ token: refreshToken });

    const newAccessToken = generateAccessToken(payload.id);
    const newRefreshToken = generateRefreshToken(payload.id);

    await Token.create({ userId: payload.id, token: newRefreshToken });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.json({ accessToken: newAccessToken });
  } catch {
    return res.sendStatus(403);
  }
};

// Logout
exports.logout = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) await Token.deleteOne({ token });
  res.clearCookie('refreshToken');
  res.sendStatus(204);
};

// // Protected Route Example
// exports.getProtectedData = async (req, res) => {
//   res.json({ message: `This is protected data for user id ${req.user.id}` });
// };