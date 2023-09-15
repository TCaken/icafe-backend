const express = require('express');
const mysql = require('mysql2');

const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser")

// Custom modules
const config = require("./config")

const app = express();
const PORT = process.env.PORT || 4000;

// MySQL User Database
const db = mysql.createConnection(config.dbConfig);
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// DB Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.set('db', db)
app.use(cookieParser());

// V1 Routes
const v1UserRouter = require("./src/v1/users/userRoutes")
const v1AdminRouter = require("./src/v1/admin/adminRoutes")

//Routes
app.use("/api/v1/users", v1UserRouter)
app.use("/api/v1/admin", v1AdminRouter)


// // Generate JWT token
// function generateToken(user) {
//   return jwt.sign({ id: user.id, username: user.username }, 'secret-key', { expiresIn: '1h' });
// }

// // Define the authenticateToken middleware
// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) {
//     return res.sendStatus(401);
//   }

//   jwt.verify(token, 'secret-key', (err, user) => {
//     if (err) {
//       return res.sendStatus(403);
//     }
//     req.user = user; // Attach decoded user information to the request
//     next();
//   });
// }

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});