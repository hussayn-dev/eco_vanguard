"use strict"

const {StatusCodes}  = require("http-status-codes")
const User = require("../models/userModel")
const error =  require("../errors/error-handler")
const crypto = require('crypto')
const {sendForgetPasswordEmail,sendVerificationEmail} = require('../utilities/mails')
const createHash = require('../utilities/createHash') 
const Token = require("../models/tokenModel")
const {sendCookies} = require("../utilities/jwt")
const bcrypt = require("bcrypt")
const {validate, userSchema } = require("../utilities/joi")





  
class AuthController {
    async signUp(req, res, next) {

        let {fullName, email, password } = req.body

        if(!fullName || !email || !password) {
          throw new error.BadRequestError("Input fields correctly")
        }
        //validation
      const validateInput = validate(userSchema, req.body)
      if(validateInput) 
            throw new error.BadRequestError(validateInput)
 
      //check if it is the first account to assign admin
        const isFirstAccount = (await User.countDocuments({})) === 0;
       const role = isFirstAccount ? 'admin' : 'user';

       // check if user exists
       email = email.toLowerCase()
        const exist = await User.exists({email})
       if(exist) throw new error.BadRequestError('Email exists, try logging in')


  
       let user = new User({fullName, email, password, role})
   
   

         // send a mail to the user for verification
         //send email to user for verification, remember to handle general email sending errors
         const verificationToken = crypto.randomBytes(40).toString('hex');
         user.verificationToken = verificationToken
         let origin =req.get('host');
         let protocol = req.protocol;

       
         origin = process.env.ORIGIN || `${protocol}://${origin}`;
        
  
        
         const mail = await sendVerificationEmail(fullName, email,verificationToken,origin)
         if(!mail) throw new error.BadRequestError('Something went wrong')
         user.verificationToken = verificationToken
      
         //save created user
         await user.save()
         //send data to front end
         const data = {
             message :  "User created successfully, check email for verification",
             user,
             status : "true"
         }
         res.status(StatusCodes.CREATED).json({data})

    }
    async verifyEmail(req, res, next) {
      const {token, email} = req.body
      const user = await User.findOne({ email });
     if (!user) {
      throw new error.UnauthenticatedError('Verification Failed, SignUp again', 'user not found');
     } 
  
     if(user.isVerified == true) {
      throw new error.BadRequestError('Click here to login', 're-verification');
     } 
  
     if(user.verificationToken != token) {
      throw new error.UnauthenticatedError('Verification Failed, SignUp again');
      }
    
    //  console.log(user)
     user.isVerified = true,
       user.verified = Date.now();
     user.verificationToken = '';
    await user.save();
    const data = {
      message : "Account Verification Successful, Click here to Login",
      status :  true,
    }
    // console.log(data)
     res.status(StatusCodes.OK).json({data})
    }
    async forgotPassword(req, res, next) {
       let {email} = req.body;
       if(!email) throw new error.NotFoundError('Please enter all fields', 'empty field')
       email = email.email.toLowerCase();
       const user = await User.findOne({email});
     
       if(!user) throw new error.NotFoundError('User does not exist', 'email not found')
       let passwordResetToken= crypto.randomBytes(70).toString('hex');
      
       const origin = `${req.protocol}://${req.get("host")}`
     
       const mail = await sendForgetPasswordEmail(user.fullName, email,passwordResetToken,origin)
         if(!mail) throw new error.BadRequestError('Something went wrong')
      
         const tenMinutes = 1000 * 60 * 10;
         const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
        
         user.passwordTokenExpirationDate = passwordTokenExpirationDate;
         user.passwordResetToken = createHash(passwordToken);

    

        await user.save()
        //send data to front end
        const data = {
            message :  "Check your email to reset your password",
            user,
            status : "true"
        }
        res.status(StatusCodes.OK).json({data})
      
      }
     async resetPassword(req, res, next) {
      const { token, email, password } = req.body;
      if (!token || !email || !password) {
        throw new error.BadRequestError('Please provide all values');
      }
     const user = await User.findOne({email})
     if(!user) throw new error.NotFoundError('User does not exist');

     const currentDate = new Date();

     if (
       user.passwordResetToken === createHash(token) &&
       user.passwordTokenExpirationDate > currentDate
     ) {
       user.password = password;
       user.passwordResetToken = null;
       user.passwordTokenExpirationDate = null;
       await user.save();
     } else throw new error.BadRequestError("Password reset failure, link expired")

     const data = {
      message :  "Password reset successfull",
      user,
      status : "true"
  }
  res.status(StatusCodes. OK).json({data})

     }

    async logIn(req, res, next) {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new error.BadRequestError('Please provide email and password');
      }
//validation
      const validateInput = validate(userSchema, req.body)
      if(validateInput) 
            throw new error.BadRequestError(validateInput)

      const user = await User.findOne({ email });
      if (!user) 
       throw new error.BadRequestError('Email not found');

       if(!await bcrypt.compare(password, user.password)) 
           throw new error.BadRequestError('Password not valid');

      if (!user.isVerified) 
           throw new error.BadRequestError('Please, verify your mail')

       const payload = {
        id : user._id,
        email : user.email,
        role : user.role,
       };
       let refreshToken = '';

       const existingToken = await Token.findOne({ user: user._id });

       if (existingToken) {
         const { isValid } = existingToken;
         if (!isValid) {
           throw new error.UnauthenticatedError('Invalid Credentials');
         }
         refreshToken = existingToken.refreshToken;
         sendCookies(res, payload ,refreshToken);
         return res.status(StatusCodes.OK).json({ user: payload});
        }



       refreshToken = crypto.randomBytes(40).toString('hex');

       await Token.create({
         refreshToken,
         user:  user._id,
       })
     
       sendCookies(res, payload, refreshToken)
      res.status(StatusCodes.OK).json({data : payload, message : "User login successfull"})
    
    }
    async logOut(req, res, next) {
      await Token.findOneAndDelete({ user: req.user.userId });

      res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
      });
      res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
      });
      res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
    } 
    gLogin (req, res, next) {
      passport.authenticate('google', {
        scope : ['profile']
      })(req, res, next)
    }
    gLoginRedirect (req, res, next) {
      passport.authenticate('google')(req, res, next)
    }
    fLogin(req, res, next) {
      passport.authenticate('facebook'), {
        scope : ['profile']
      }(req, res,next)
    }
    fLoginRedirect(req, res, next) {
      passport.authenticate('facebook')(req, res, next)
    }
}

const auth = new AuthController()
module.exports = auth