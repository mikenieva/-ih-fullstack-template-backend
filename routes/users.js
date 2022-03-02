const express = require("express")
const router = express.Router()

const authorization = require("./../middlewares/authorization")

const userController = require("./../controllers/usersController")


router.post("/create", userController.create)

router.post("/login", userController.login)

router.get("/verifytoken", authorization, userController.verifyToken)


module.exports = router
