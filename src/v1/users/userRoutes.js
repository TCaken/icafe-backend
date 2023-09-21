const express = require("express");
const userService = require("./userService")
const { withAuth } = require("../middleware")

const router = express.Router();

// router.use(withAuth)

router.get("/", userService.getAllUsers);

router.post("/", userService.createUser);

//router.get("/profile/:userId", userService.get)
//router.post("/topup/:userId", userService.topup)

router.get("/:userId", userService.getUser);

router.delete("/:userId", userService.deleteUser)


module.exports = router;