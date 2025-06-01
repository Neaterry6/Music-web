const fs = require('fs');
const path = require('path');

const USERS_DB = path.join(__dirname, '../users.json');

// Get user profile
module.exports.getProfile = (req, res) => {
  const { email } = req.query;

  const users = JSON.parse(fs.readFileSync(USERS_DB, 'utf8'));
  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found!' });
  }

  res.status(200).json(user);
};