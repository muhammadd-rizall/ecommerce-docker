const express = require('express');
const app = express();

//DUmmy data user
const users = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "customer" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "seller" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "admin" }
];

// Endpoint untuk mendapatkan daftar user
app.get('/users', (req, res) => {
  res.json(users);
});

// Endpoint untuk mendapatkan detail user berdasarkan ID
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Endpoint untuk menambahkan user baru
app.use(express.json());
app.post('/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// endpoint untuk menghapus user berdasarkan ID
app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.json({ message: 'User deleted successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Menjalankan server pada port 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`User service is running on port ${PORT}`);
});

