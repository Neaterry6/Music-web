const fs = require('fs');
const path = require('path');

const USERS_DB = path.join(__dirname, '../users.json');

// Handle user registration
module.exports.signup = (req, res) => {
  const { username, email, password, profilePic } = req.body;

  const users = JSON.parse(fs.readFileSync(USERS_DB, 'utf8'));

  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'User already exists!' });
  }

  const newUser = { id: Date.now(), username, email, password, profilePic: profilePic || null };
  users.push(newUser);
  fs.writeFileSync(USERS_DB, JSON.stringify(users, null, 2));

  res.status(201).json({ message: 'User registered successfully!' });
};

// Handle user login
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  const users = JSON.parse(fs.readFileSync(USERS_DB, 'utf8'));
  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials!' });
  }

  res.status(200).json({ message: 'Login successful!', user });
};