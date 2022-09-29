const User = require("../models/userModel")
const error = require("../errors/error-handler")
const { StatusCodes } = require("http-status-codes")
const Profile = require("../models/profileModel")
const {validate, userSchema } = require("../utilities/joi")
// const { singleUpload, uploadImage } = require("../utilities/multer")

 // console.log(file)
//  const uploadResponse = await cloudinary.uploader.upload(file.path, {
//   folder: 'users',
// });

class UserController {
  async getMe(req, res, next) {
    console.log(req.user)
    const user = await User.findById(req.user.id)
    // console.log(user)
    let userProfile = {}
    if(user.profile) {
      await user.populate("profile", "-_id");
      userProfile = user.profile
    }

    const data = {
      user: req.user,
      profile: userProfile
    }
    res.status(StatusCodes.OK)
    .json({ 
      data, 
      status: true, 
      message: "Successfull" 
    })

  }
  async editMe(req, res, next) {
    const user = await User.findById(req.params.id)
    if (!user) throw new error.BadRequestError("User not found")

    const { password, confirmPassword } = req.body
    
    if (!password || !confirmPassword) {
      throw new error.BadRequestError('Input required fields', "Missing Input")
    }

    if (password !== confirmPassword){
      throw new error.BadRequestError("Password do not match")
    } 
    //validation
    const validateInput = validate(userSchema, req.body)
    if(validateInput) 
          throw new error.BadRequestError(validateInput)

    user.password = password
    await user.save()


    res.status(StatusCodes.OK)
    .json({ 
      data: user, 
      status: true,
       message: "password updated successfully " 
      })






  }



  async deleteMe(req, res, next) {
    const user = await User.findById(req.user.id)
    const profile = await Profile.findById(req.user.profile)
    await user.remove() & await profile.remove()
    res.status(StatusCodes.OK).json({ status: true, message: "Deleted successfully" })
  }
 
  async editImage(req, res, next) {
    const { id: userId } = req.params

    if (req.user._id == userId || req.user.role == "admin") {
      let message = "";
      let user = await User.findById(userId)
      if (!user) throw new NotFoundError('User not found')
      const imageFile = await uploadImage(singleUpload, req, res)

      if (imageFile) {
        await cloudinary.uploader.destroy(user.imagePublicId);
        const uploadResponse = await cloudinary.uploader.upload(imageFile.path, {
          folder: 'users',
      });
      user.imagePublicId = uploadResponse.public_id
      user.imageSecureUrl = uploadResponse.secure_url
      message = "Updates made successfully"
      } else {message = "No updates made"}

      await user.save()
      const data = {
        user,
        message,
        status: true
      }
      res.status(StatusCodes.OK).json({ data: data })
    }


  }
  async deleteImage(req, res, next) {
    const {id : userId} = req.params 
        
    let user = await   User.findById(userId)
    if(!user) throw new error.NotFoundError('Event not found');
    await cloudinary.uploader.destroy(user.imagePublicId);
    user.imagePublicId = '';
    user.imageSecureUrl = '';
    await user.save()
              const data = {
                  user ,
                  message : "Image deleted successfully",
                  status : true
          }   
          res.status(StatusCodes.OK).json({data})
  }
}


class AdminController { 
  // remember to add req.query
  async getUsers(req, res, next) {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select("-updatedAt")
      .sort("-createdAt")
      .populate("profile", "-_id")
    res.status(StatusCodes.OK).json({ data: users, amount: users.length, status: true, message: "successful" })
  }
  async getUser(req, res, next) {
    const { id: userId } = req.params
    const user = await User.findById(userId)
      .select("-createdAt -updatedAt")
      .populate("profile", "-_id")
    if (!user) throw new error.NotFoundError("User not found")
    res.status(StatusCodes.OK).json({ data: user, status: true, message: "successful" })
  }
  async deleteUser(req, res, next) {
    const { id: userId } = req.params
    const user = await User.findById(userId)
    if (!user) throw new error.NotFoundError("User not found")
    const profile = await Profile.findById(user.profile)
    if (!profile) throw new error.NotFoundError("User profile not found")
    await req.user.remove()
    await profile.remove()
    res.status(StatusCodes.OK).json({ status: true, message: "Deleted successfully" })
  }

}
const user = new UserController()
const admin = new AdminController()

module.exports = {
  user,
  admin
}