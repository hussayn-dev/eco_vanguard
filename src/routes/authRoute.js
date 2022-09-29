const express = require("express")
const router = express.Router()
const auth = require("../controllers/auth.controller")
const {StatusCodes} = require("http-status-codes")
const {authenticateUser} = require("../middlewares/auth-workflow")


router.post("/register",auth.signUp)
router.post("/login", auth.logIn)
router.post("/logout",authenticateUser, auth.logOut)
   

router.post('/verify-email',auth.verifyEmail)


router.post('/forgot-password',auth.forgotPassword )
router.post('/reset-password', auth.resetPassword)


//google signUp
router.get("/oauth/google", auth.gLogin)
router.get("/oauth/google/redirect", auth.gLoginRedirect)


// facebook signUp
router.get("/oauth/facebook",  auth.fLogin)
router.get("/oauth/facebook/facebook",auth.fLoginRedirect)


module.exports = router