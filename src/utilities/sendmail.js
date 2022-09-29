const nodemailer = require('nodemailer')
const error =  require("../errors/error-handler")

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port:  465,
  auth: {
    user: "ecovanguardclub@gmail.com",
    pass: "exrqadzmngijctcu"
  }
});



class SendMail {
    constructor(email, subject, text= '', html) {
        this.email = email
        this.subject = subject,
        this.text = text
        this.html = html
    }
    async mail () {
      try {
    
        const  info =   await transporter.sendMail({
          from : "ecovanguardclub@gmail.com", 
        to : this.email, 
        subject : this.subject,
        text : this.text, 
        html : this.html
          })
          console.log(info)
          return info
      } catch(err) {
       console.log(err)
         throw new error.InternalServerError('Something went wrong','email not sent')
      }



    }
}

module.exports = SendMail