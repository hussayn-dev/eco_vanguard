const express = require("express");
const router = express.Router();
const profile = require("../controllers/profile.controller");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/auth-workflow");

router.post(
  "/createProfile",
  authenticateUser,
  upload.single("profilePicture"),
  profile.userProfile
);
router.patch("/updateProfile", authenticateUser, profile.editProfile);

module.exports = router;
