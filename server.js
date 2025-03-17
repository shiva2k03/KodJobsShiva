const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

// Path to users.json file
const usersFilePath = path.join(__dirname, 'users.json');

// Helper function to read users.json
const readUsersFile = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty users array
    return { users: [] };
  }
};

// Helper function to write to users.json
const writeUsersFile = (data) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Calculate age from DOB
const calculateAge = (dob) => {
  const [day, month, year] = dob.split('/');
  const birthDate = new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// API Routes
// Get all users
app.get('/api/users', (req, res) => {
  try {
    const data = readUsersFile();
    res.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Add a new user
app.post('/api/users', (req, res) => {
  try {
    const { username, password, email, dob } = req.body;
    
    // Validate input
    if (!username || !password || !email || !dob) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Read current users
    const data = readUsersFile();
    
    // Check if username already exists
    if (data.users.some(user => user.username === username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Format date to DD/MM/YY
    const formattedDate = new Date(dob);
    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = formattedDate.getFullYear().toString().slice(2);
    const formattedDob = `${day}/${month}/${year}`;
    
    // Create new user with format matching the image
    const newUser = {
      id: data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 1,
      username,
      password,
      email,
      DOB: formattedDob,
      age: 'calculate'
    };
    
    // Add to users array
    data.users.push(newUser);
    
    // Write back to file
    writeUsersFile(data);
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Login route
app.post('/api/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Read users
    const data = readUsersFile();
    
    // Find matching user
    const user = data.users.find(u => u.username === username && u.password === password);
    
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Serve React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/update-users', (req, res) => {
  const { users } = req.body;
  fs.writeFile('users.json', JSON.stringify({ users }, null, 2), (err) => {
    if (err) {
      console.error('Error writing to users.json:', err);
      return res.status(500).send('Error updating users');
    }
    res.send('Users updated successfully');
  });
}); 