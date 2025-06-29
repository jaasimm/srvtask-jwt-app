exports.getProtectedData = (req, res) => {
  res.json({ message: `This is protected data for user ${req.user.id}` });
};
