const express		= require("express")
const router		= express.Router()

const petsController	= require("./../controllers/petsController")

router.get("/", petsController.getPets)

router.post("/create", petsController.createPet)

module.exports = router