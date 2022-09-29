const {StatusCodes} = require('http-status-codes')

class customAPIError extends Error{
    constructor(message, path = null){
       super(message)
       this.path = path
       this.status = false
    }
}
class BadRequestError extends customAPIError {
    constructor(message, path) {
        super(message, path)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}
class InternalServerError extends customAPIError {
  constructor(message, path) {
    super(message, path)
      this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  }
}

class NotFoundError extends customAPIError {
  constructor(message, path) {
    super(message, path)
      this.statusCode = StatusCodes.NOT_FOUND;
    }
    
  }
  
  class UnauthenticatedError  extends customAPIError {
    constructor(message, path) {
      super(message, path)
      this.statusCode = StatusCodes.UNAUTHORIZED;
    }
    
  }
  
class UnauthorizedError extends customAPIError {
  constructor(message, path) {
    super(message, path)
      this.statusCode = StatusCodes.FORBIDDEN;
    }
  }
  
module.exports= {
    UnauthenticatedError,
    InternalServerError,
    BadRequestError,
    UnauthorizedError,
    NotFoundError
}





// router.get("/", async (req, res) => {
//   try {
//     let user = await User.find();
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.delete("/:id", async (req, res) => {
//   try {
//     // Find user by id
//     let user = await User.findById(req.params.id);
//     // Delete image from cloudinary
//     await cloudinary.uploader.destroy(user.cloudinary_id);
//     // Delete user from db
//     await user.remove();
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });

// router.put("/:id", upload.single("image"), async (req, res) => {
//   try {
//     let user = await User.findById(req.params.id);
//     // Delete image from cloudinary
//     await cloudinary.uploader.destroy(user.cloudinary_id);
//     // Upload image to cloudinary
//     let result;
//     if (req.file) {
//       result = await cloudinary.uploader.upload(req.file.path);
//     }
//     const data = {
//       name: req.body.name || user.name,
//       avatar: result?.secure_url || user.avatar,
//       cloudinary_id: result?.public_id || user.cloudinary_id,
//     };
//     user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });