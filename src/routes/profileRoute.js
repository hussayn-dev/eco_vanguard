const express = require("express")
const router = express.Router()
const profile = require("../controllers/profile.controller")
const {authenticateUser, authorizeRoles} = require("../middlewares/auth-workflow")



router.post("/createProfile", authenticateUser, profile.userProfile)
router.patch("/updateProfile",authenticateUser, profile.editProfile)



module.exports = router