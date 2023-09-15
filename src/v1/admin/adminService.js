const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const getAllAdmins = (req, res) => {
    const db = req.app.get('db')
    db.query('SELECT id, name amount, email FROM admin WHERE activated', (err, results) => {
        if (err) {
          console.error('Error fetching admin details:', err);
          return res.status(500).json({ message: 'Error fetching admin details' });
        }
        res.json(results);
    })
}

const getAdmin = (req, res) => {
    const db = req.app.get('db');
    const id = req.params.adminId;

    db.query('SELECT id, name, email FROM admin WHERE id = ?', 
        [id], 
        (err, results) => {
            if (err) {
            console.error('Error fetching admin details:', err);
            return res.status(500).json({ message: 'Error fetching admin details' });
            }
        
            if (results.length === 0) {
            return res.status(404).json({ message: 'admin not found' });
            }
        
            const admin = results[0];
            return res.json(admin);
        }
    )
}

const login = (req, res) => {
    const db = req.app.get('db');
    const { email, password } = req.body;

    db.query('SELECT id, name, password FROM admin WHERE email = ?', [email], (err, results) => {
        console.log("Results: ", results)
        if (err) return res.json({ message : 'Server Error!'});
        else if (results.length !== 1) {
            return res.status(400).json({ message: 'Email or password does not exist!' });
        }
        else{
            const admin = results[0]

            if(password !== admin.password){
                return res.status(400).json({ message: 'Email or password does not exist!' });
            }
            else{
                // Issue token
                const payload = { id : admin.id };
                const token = jwt.sign(payload, "secret", {
                   expiresIn: '1h'
                });
                res.cookie('token', token).sendStatus(200);
            }
        }
    })

}

const deleteAdmin = (req, res) => {
    const db = req.app.get('db');
    const id = req.params.adminId

    console.log(id)

    try {
        db.query('UPDATE admin SET activated = false WHERE id = ?', 
        [id], 
        (err, results) => {
            console.log(results)
            if (err) {
                console.error('Error deleting admin details:', err);
            }
            // Check if any rows were affected (admin deleted)
            if (results.affectedRows > 0) { 
                return res.json({ message: `Admin with ID ${id} and cards has been deleted. ` })
            } else {
                return res.json({ message: `Admin with ID ${id} not found.` });
            }
        })
    } catch (error) {
        return res.json({ message: `Error deleting admin: ${error}` });
    }
}

const checkAuth = (req, res) => {
    return res.json({ isAuthenticated : true })
}

module.exports = {
    login,
    checkAuth,
    getAllAdmins,
    getAdmin,
    deleteAdmin,
}