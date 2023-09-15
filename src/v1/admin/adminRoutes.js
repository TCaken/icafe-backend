const express = require("express");
const adminService = require("./adminService")
const userService = require("../users/userService")
const { withAuth } = require('../middleware');
//const workoutController = require("../../controllers/workoutController");

const router = express.Router();

router.get("/", adminService.getAllAdmins);

router.post("/login", adminService.login)

router.get('/secret', withAuth, function(req, res) {
    res.send(`The password is potato ${req.id}`);
  });

router.get('/checkAuth', withAuth, adminService.checkAuth)

router.get("/:adminId", adminService.getAdmin)

router.delete("/:adminId", adminService.deleteAdmin)

module.exports = router;