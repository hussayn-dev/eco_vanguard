const error= require('../errors/error-handler')
const {sendCookies, verifyJwt} = require("../utilities/jwt")
const Token = require('../models/tokenModel')

const authenticateUser = async(req, res,next) => {
  try {
    const { refresh_token, access_token } = req.signedCookies;

    // Check if user has an access token
     if(access_token){
       const payload = verifyJwt(access_token)
       if(!payload)  throw new error.UnauthenticatedError("Authentication Invalid")
      //  console.log(payload)
          req.user = payload
         return next()
     } else {
     // If user doesn't have access_token check for refresh_token
 
     if(refresh_token) {
       const payload = verifyJwt(refresh_token)
         if(!payload) 
              throw new error.UnauthenticatedError("Authentication Invalid")
 
         // search for the token
             const token = await Token.findOne({
             refreshToken : payload.refreshToken,
             user : payload.user._id
               })
        // If token doesn't exixt or token isn't valid
        if(!token || !token.isValid)
          throw new error.UnauthenticatedError("Authentication Invalid")
          //send cookies creating both access and refresh tokens
       
          sendCookies(res, payload.user , refresh_token)
             console.log(payload.user)
          req.user = payload.user;
          return next();
              } else {
                throw new error.UnauthenticatedError("Authentication Invalid")
              }
            }

        } catch (error) {
         next(error)
       }


    }



const authorizeRoles = (...role) => {
    return (req, res, next) => {
      if (!role.includes(req.user.role)) throw new error.UnauthorizedError('Unauthorized to access this route');
      
      next();


    };
  };

module.exports = {
authenticateUser, authorizeRoles
}