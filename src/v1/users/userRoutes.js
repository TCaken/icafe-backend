const express = require("express");
const userService = require("./userService")
const { withAuth } = require("../middleware")

const router = express.Router();

// router.use(withAuth)

router.get("/", userService.getAllUsers);

router.post("/", userService.createUser);

//router.get("/profile/:userId", userService.get)
//router.post("/topup/:userId", userService.topup)

router.post("/balance/:userId", userService.addUserBalance)

router.get("/:userId", userService.getUser)
router.put("/:userId", userService.editUser)
router.delete("/:userId", userService.deleteUser)


module.exports = router;