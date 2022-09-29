const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const validator = require("validator")


const userSchema = new mongoose.Schema({
    fullName : {
        type :  String,
    },
    email: {
        type: String,
        unique: true,
        required : [true, 'Please provide email'],
        validate : {
            validator: validator.isEmail,
            message: "Please provide a valid email"
        },
        lowercase : true,
    },
    password : {
        type: String,
        required : true,
        trim : true,
        minlength :  [6, "Password can't be less than 6 characters"]
    
    },  role: {
        type: String,
        enum: ["admin", "user"],
        default: 'user',
      }, 
      imagePublicId :String,
      imageSecureUrl : String,
      profile : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Profile"
      }, googleId : String,
      facebookId : String,
      verificationToken: String,
      isVerified: {
        type: Boolean,
        default: false,
      },
      verified: Date,
      passwordResetToken : String,
      passwordTokenExpirationDate: {
        type: Date,
      }
      
},{ 
    toObject: {
    transform: function (doc, ret) {
      delete ret.profilePicture;
    }
  },
  toJSON: {
    transform: function (doc, ret) {
      delete ret.profilePicture;
    }
  }
  } ,{
    timestamps: true
})





userSchema.pre('save', async function (done) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    done()
})

module.exports = mongoose.model("User", userSchema)