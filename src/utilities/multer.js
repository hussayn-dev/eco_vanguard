const multer = require("multer")
const path = require('path')

const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter (req, file, cb) {
     fileCheck(file,cb)   
    },
    limits : {
        fileSize: 1000
          },
}) 
function fileCheck(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if(mimetype && extname) {
   
        return cb(null, true)

    } else {
        cb({message : "Upload only images",
      status : false, 
    statusCode : 400})
    }
}
const singleUpload = upload.single('profilePicture')
const projectUpload = upload.single('projectPicture')
const eventUpload = upload.single('eventPicture')

const uploadImage = (upload, req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if(err) reject(err)
            else {
              resolve(req.file)
              
            }
        })
    })
}
module.exports = {singleUpload, uploadImage, projectUpload, eventUpload}