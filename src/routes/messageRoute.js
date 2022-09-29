const express = require("express")
const router = express.Router()
const message = require("../controllers/message.controller")
const {authenticateUser, authorizeRoles} = require("../middlewares/auth-workflow")


router.post("/create", message.all)
router.get("/all", authenticateUser, authorizeRoles("admin"), message.all)
router.route('/:id')
.get(authenticateUser, authorizeRoles("admin"),message.find)
// .patch(authenticateUser, authorizeRoles("admin"),message.update)
.delete(authenticateUser, authorizeRoles("admin"), message.destroy)







module.exports = router