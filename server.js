const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// MySQL User Database
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'caken',
  password: '120788',
  database: 'test'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Generate JWT token
function generateToken(user) {
  return jwt.sign({ id: user.id }, 'secret-key', { expiresIn: '1h' });
}

// Define the authenticateToken middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'secret-key', (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user; // Attach decoded user information to the request
    next();
  });
}

app.get('/', (req, res) => {
  res.send("<h1>Express</h1>")
})

// Authentication endpoint
app.post('/api/login', (req, res) => {
  console.log('Received login request:', req.body);
  const { email, password } = req.body;

  // console.log("User in Database: ", user)
  // console.log("Hashed Password: ", bcrypt.hashSync(password, numSaltRounds))
  // console.log("Comparing Password: ", bcrypt.compareSync(password, user.password))

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    console.log("Results: ", results)
    if (err) throw err;

    if (results.length === 0 || !bcrypt.compareSync(password, results[0].hashed_password)) {
      return res.json({ message: 'Invalid credentials' });
    }
    
    const user = results[0];
    const token = generateToken(user);
    res.json({ token : token, message : "Login Successfully!" });
  });
});

// Registration endpoint
app.post('/api/register', (req, res) => {
  const { name, email, username, password, confirmPassword } = req.body;

  if(password !== confirmPassword){
    console.error('Password mismatch during registration :', password, confirmPassword);
    return res.json({ message: 'Password mismatch!' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  db.query(
    'INSERT INTO users (name, email, username, password, hashed_password) VALUES (?, ?, ?, ?, ?)',
    [name, email, username, password, hashedPassword],
    (err, result) => {
      if (err) {
        console.error('Error during registration:', err);
        return res.json({ message: 'Registration failed' });
      }
      res.json({ message: 'Registration successful' });
    }
  );
});

app.get("/api/user", authenticateToken, (req, res) => {
  const userId = req.user.id; // Retrieve user ID from the decoded token

  db.query('SELECT id, name, username, email FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user details:', err);
      return res.status(500).json({ message: 'Error fetching user details' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    res.json(user);
  });
})

app.get("api/users/getcards", (req, res) => {
  db.query('SELECT U1.id, U1.username, U1.email, C1.card_id FROM test.users AS U1, test.cards as C1 WHERE U1.id = C1.user_id and C1.activated;', (err, results) => {
    if (err) {
      console.error('Error fetching user details:', err);
      return res.json({message: 'Error reading from database'});
    }
  
    console.log("Results:",results)
    const cards = results[0];
    res.json(cards);
  })
})

app.post("/api/users/logincard", (req, res) => {
  const {cardId} = req.body
  console.log("cardId:", cardId)

  db.query('SELECT name, username, password, email, password FROM users WHERE id IN (SELECT user_id FROM cards WHERE card_id = ? and activated);', [cardId], (err, results) => {
    if (err) {
      console.error('Error fetching user details:', err);
      return res.json({message: 'Error during reading card'});
    }
    else if (results.length === 0) {
      return res.json({ message: 'Card not found' });
    }
    else if (results.length > 1){
      return res.json({ message: 'Abnormal card' });
    }

    console.log("Results:",results)
    const user = results[0];
    res.json(user);
  })
})

app.get("/api/users/getusers", (req, res) => {
  db.query('SELECT id, name, username, email, amount FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching user details:', err);
      return res.status(500).json({ message: 'Error fetching user details' });
    }
    res.json(results);
  })
})

app.get("/api/users/get/:id", (req, res) => {
  db.query('SELECT id, name, username, email, amount FROM users WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching user details:', err);
      return res.status(500).json({ message: 'Error fetching user details' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    res.json(user);
  })
})

app.post("/api/users/create", (req, res) => {
  console.log(req.body)
  const { name, email, username, password, confirmPassword, amount } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    'INSERT INTO users (name, email, username, password, hashed_password, amount) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, username, password, hashedPassword, parseInt(amount)],
    (err, result) => {
      if (err) {
        console.error('Error during registration:', err);
        return res.json({ message: 'Registration failed' });
      }
      res.json({ message: 'Registration successful' });
    }
  );
})

app.get("/api/users/update/:id", (req, res) => {
  console.log("Update id: ", req.params.id)
})

app.post("/api/users/delete/:id", (req, res) => {
  const userId = req.params.id
  console.log("Delete id: ", req.params.id)

  try {
    // SQL DELETE query
    db.query(
      'DELETE FROM users WHERE id = ?', 
      [userId], 
      (err, results) => {
        // Check if any rows were affected (user deleted)
        if (results.affectedRows > 0) {
          return res.json({ message: `User with ID ${userId} has been deleted.` })
        } else {
          return res.json({ message: `User with ID ${userId} not found.` });
        }
      }
    )
  } catch (error) {
    return res.json({ message: `Error deleting user: ${error}` });
    console.error('Error deleting user:', error);
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app