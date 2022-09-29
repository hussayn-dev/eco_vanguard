const SendMail = require('./sendmail')
const sendVerificationEmail  = async(name, email, token, origin) => {
    const verifyEmail = `${origin}/api/v1/auth/verify-email?token=${token}&email=${email}`;
    
    const message = `<p>Please confirm your email by clicking on the following link : 
    <a href="${verifyEmail}">Verify Email</a> </p>`;
    const sendMail = new SendMail(email, "Email Confirmation", "", `<h4> Hello, ${name}</h4>${message}` )
    return sendMail.mail()
}   
const sendForgetPasswordEmail = async(name, email, token, origin ) => {
const passwordLink = `${origin}/api/v1/auth/reset-password?token=${token}&email=${email}`
const message = `<p>Pleaseclick on this link to reset your password : 
<a href="${passwordLink}">Reset Password</a> </p>`;
const sendMail = new SendMail(email, "Password Reset", "", `<h4> Hello, ${name}</h4>${message}` )
return sendMail.mail()
}
    module.exports = {sendForgetPasswordEmail, sendVerificationEmail};
    