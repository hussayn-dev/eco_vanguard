const express = require("express");
const router = express.Router();
const { user, admin } = require("../controllers/user.controller");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/auth-workflow");

//user details

router.get("/show", authenticateUser, user.getMe);
router.patch("/editMe", authenticateUser, user.editMe);
router.delete("/deleteMe", authenticateUser, user.deleteMe);

// admin on images
router.patch(
  "/avatar/:id",
  authenticateUser,
  upload.single("profilePicture"),
  user.editImage
);
router.delete("/avatar/:id", authenticateUser, user.deleteImage);
// admin  extra access
router.get("/users", authenticateUser, authorizeRoles("admin"), admin.getUsers);
router
  .route("/id/:id", authenticateUser, authorizeRoles("admin"))
  .get(admin.getUser)
  // .patch(admin.editUser)
  .delete(admin.deleteUser);

module.exports = router;
