const getAllUsers = (req, res) => {
    const db = req.app.get('db')
    db.query('SELECT u1.id, u1.name, u1.username, a1.value, u1.email FROM users u1, amount a1 WHERE u1.id = a1.user_id AND u1.activated;', (err, results) => {
        if (err) {
          console.error('Error fetching user details:', err);
          return res.status(500).json({ message: 'Error fetching user details' });
        }
        res.json(results);
    })
}

const createUser = (req, res) => {
    const db = req.app.get('db')
    const name = req.body.name
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const password2 = req.body.confirm_password
    const value = (req.body.value || 0)

    if(password === password2){
        let query_string = 'INSERT INTO users (name, email, username, password, hashed_password) VALUES (?, ?, ?, ?, ?);'
        query_string += 'INSERT INTO amount (user_id, value) VALUES (LAST_INSERT_ID(), ?);'
        db.query(
            query_string,
            [name, email, username, password, password, value],
            (err, result) => {
              if (err) {
                console.error('Error during registration:', err);
                return res.json({ message: 'Registration failed' });
              }
              else{
                res.status(500).json({ message: 'Registration successful' });
              }
            }
          );
    } else {
        return res.status(500).json({ message: "Passwords do not match!" });
    }
}

const getUser = (req, res) => {
    const db = req.app.get('db');
    const id = req.params.userId;

    db.query('SELECT id, name, username, email FROM users WHERE id = ?', 
        [id], 
        (err, results) => {
            if (err) {
            console.error('Error fetching user details:', err);
            return res.status(500).json({ message: 'Error fetching user details' });
            }
        
            if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
            }
        
            const user = results[0];
            return res.json(user);
        }
    )
}

const deleteUser = (req, res) => {
    const db = req.app.get('db');
    const id = req.params.userId

    console.log(id)

    try {
        db.query('UPDATE users SET activated = false WHERE id = ? and activated', 
        [id], 
        (err, results) => {
            console.log(results)
            if (err) {
                console.error('Error deleting user details:', err);
            }
            // Check if any rows were affected (user deleted)
            if (results.affectedRows > 0) { 
                // Deactivate user's card
                db.query('UPDATE cards SET activated = false WHERE user_id = ?',
                [id], 
                (err2, results2) => {
                    console.log(results2)
                    if (err2) {
                        console.error('Error deleting card details:', err2);
                    }
                })
                return res.json({ message: `User with ID ${id} and cards has been deleted. ` })
            } else {
                return res.json({ message: `User with ID ${id} not found.` });
            }
        })
    } catch (error) {
        return res.json({ message: `Error deleting user: ${error}` });
    }
}

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    deleteUser
}