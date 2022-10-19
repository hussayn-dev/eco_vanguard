const express = require("express");
const router = express.Router();
const event = require("../controllers/event.controller");
const upload = require("../utilities/multer");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/auth-workflow");

router.post(
  "/create",
  authenticateUser,
  authorizeRoles("admin"),
  upload.single("eventPicture"),
  event.createEvent
);
router.get("/allevents", event.getAll);

router
  .route("/:id")
  .get(event.getOne)
  .patch(authenticateUser, authorizeRoles("admin"), event.editOne)
  .delete(authenticateUser, authorizeRoles("admin"), event.deleteOne);

router.patch(
  "/avatar/:id",
  authenticateUser,
  authorizeRoles("admin"),
  upload.single("eventPicture"),
  event.editImage
);
router.delete(
  "/avatar/:id",
  authenticateUser,
  authorizeRoles("admin"),
  event.deleteImage
);

module.exports = router;
