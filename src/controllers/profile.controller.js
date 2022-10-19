const User = require("../models/userModel");
const error = require("../errors/error-handler");
const { StatusCodes } = require("http-status-codes");
const { validate, profileSchema } = require("../utilities/joi");
const Profile = require("../models/profileModel");
const cloudinary = require("../config/cloudinary");

class ProfileController {
  async userProfile(req, res, next) {
    const user = await User.findById(req.user.id);
    if (!user)
      throw new error.NotFoundError("This user has been deleted", "not found");

    //validation
    const validateInput = validate(profileSchema, req.body);
    if (validateInput) throw new error.BadRequestError(validateInput);

    // user uploads picture

    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload(imageFile.path, {
        folder: "users",
      });
      user.imagePublicId = uploadResponse.public_id;
      user.imageSecureUrl = uploadResponse.secure_url;
    }

    const { type } = req.query;

    let profile;

    if (type == "institution") {
      let {
        fullName,
        age,
        cityOfResidence,
        activeMedia,
        faculty,
        department,
        institution,
        level,
        yearOfAdmission,
        yearOfGraduation,
      } = req.body;

      if (isNaN(age)) throw new error.BadRequestError("Input Appropriate Age");

      if (
        !age ||
        !fullName ||
        !activeMedia ||
        !cityOfResidence ||
        !faculty ||
        !department ||
        !institution ||
        !level ||
        !yearOfAdmission ||
        !yearOfGraduation
      )
        throw new error.BadRequestError(
          "Input fields correctly",
          "wrong input"
        );

      profile = new Profile({
        fullName,
        age,
        cityOfResidence,
        activeMedia,
        faculty,
        department,
        institution,
        level,
        yearOfAdmission,
        yearOfGraduation,
      });
      profile.type = type;
      profile.owner = user._id;
      user.profile = profile._id;
    } else if (type == "secondary") {
      let {
        fullName,
        age,
        cityOfResidence,
        schoolLocation,
        schoolName,
        studentClass,
        yearOfAdmission,
        yearOfGraduation,
      } = req.body;
      if (isNaN(age))
        throw new error.BadRequestError("Input Appropriate Age", "age");
      if (
        !age ||
        !fullName ||
        !cityOfResidence ||
        !schoolLocation ||
        !schoolName ||
        !studentClass ||
        !yearOfAdmission ||
        !yearOfGraduation
      )
        throw new error.BadRequestError(
          "Input fields correctly",
          "wrong input"
        );
      profile = new Profile({
        fullName,
        age,
        cityOfResidence,
        schoolLocation,
        schoolName,
        studentClass,
        yearOfAdmission,
        yearOfGraduation,
      });
      profile.type = type;
      profile.owner = user._id;
      user.profile = profile._id;
    } else if (type == "school") {
      let { cityOfResidence, schoolLocation, schoolName, fullName } = req.body;
      if (!cityOfResidence || !schoolLocation || !schoolName || !fullName)
        throw new error.BadRequestError(
          "Input fields correctly",
          "wrong input"
        );
      profile = new Profile({
        fullName,
        cityOfResidence,
        schoolLocation,
        schoolName,
      });
      profile.type = type;
      profile.owner = user._id;
      user.profile = profile._id;
    } else {
      if (user.role != "admin") {
        throw new error.BadRequestError("Invalid user type");
      }
      await user.save();
      return res
        .status(StatusCodes.CREATED)
        .json({
          data: user,
          status: true,
          message: "User created successfully",
        });
    }

    (await profile.save()) & (await user.save());
    const data = {
      profile,
      status: true,
    };
    res
      .status(StatusCodes.CREATED)
      .json({ data, message: "User created successfully" });
  }
  async editProfile(req, res, next) {
    let user = await User.findById(req.user.id);
    // console.log(user)
    if (!user)
      throw new error.NotFoundError("This user doesn't exist", "not found");

    await user.populate("profile");
    // console.log(user.profile)
    let allowedUserUpdates = [];
    let type = user.profile.type;

    console.log(type);
    if (type == "secondary") {
      allowedUserUpdates = [
        "fullName",
        "age",
        "cityOfResidence",
        "schoolLocation",
        "schoolName",
        "studentClass",
        "yearOfAdmission",
        "yearOfGraduation ",
      ];
    } else if (type == "institution") {
      allowedUserUpdates = [
        "fullName",
        "age",
        "cityOfResidence",
        "activeMedia",
        "faculty",
        "department",
        "institution",
        "level",
        "yearOfAdmission",
        "yearOfGraduation",
      ];
    } else if (type == "school") {
      allowedUserUpdates = [
        "fullName",
        "cityOfResidence",
        "schoolLocation",
        "schoolName",
      ];
    }

    const updates = Object.keys(req.body);

    //validator
    const validateInput = validate(profileSchema, req.body);
    if (validateInput) throw new error.BadRequestError(validateInput);

    const isValidOperation = updates.every((update) => {
      return allowedUserUpdates.includes(update);
    });

    console.log(isValidOperation);
    if (!isValidOperation) throw new error.NotFoundError("Property not found");

    updates.forEach(async (update) => {
      user.profile[update] = req.body[update];
    });

    await user.profile.save();
    const data = {
      data: user.profile,
      status: true,
      message: "update made successfully",
    };
    res.status(StatusCodes.OK).json({ data });
  }
}
const profileController = new ProfileController();

module.exports = profileController;
