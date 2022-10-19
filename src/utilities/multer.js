const multer = require("multer");
const path = require("path");

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter(req, file, cb) {
    fileCheck(file, cb);
  },
  limits: {
    fileSize: 10000,
  },
});
function fileCheck(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb({ message: "Upload only images", status: false, statusCode: 400 });
  }
}

module.exports = upload;
