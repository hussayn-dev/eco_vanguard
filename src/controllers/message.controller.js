"use strict"
const Message = require("../models/messageModel")
const error = require("../errors/error-handler")
const {StatusCodes} = require("http-status-codes")
const {validate, messageSchema } = require("../utilities/joi")
// const cloudinary = require('../config/cloudinary')


class MessageController {
async all(req, res, next) {
    let messages = await Message.find({}).sort('-createdAt')
    res.status(StatusCodes.CREATED).json({data : messages , length : messages.length, status : true, message : "successfull"})
}
async find (req, res, next) {
    const message = await Message.findById(req.params.id)
    if(!message) throw new error.BadRequestError("message not found")
    res.status(StatusCodes.OK).json({data : message, status : true, message : "Successful"  })   
}
async create (req, res, next) {
    let {name, email, message} = req.body
    if(!name || !email ||  !message) throw new error.BadRequestError("Input fields correctly")
    
   //validation
 //validation
 const validateInput = validate(messageSchema, req.body)
 if(validateInput) 
       throw new error.BadRequestError(validateInput)




    const newMessage = new Message({name, email, message} )
    await newMessage.save()
    res.status(StatusCodes.CREATED).json({data : newMessage, status : true, message : "Message sent successfully"})
   

}

async update (req, res, next) {
    const message = await Message.findById(req.params.id)
    if(!message)
       throw new error.BadRequestError("message not found")
    
    //validation
    const validateInput = validate(messageSchema, req.body)
    if(validateInput) 
          throw new error.BadRequestError(validateInput)


    const updates = Object.keys(req.body)
    const allowedTasksUpdates = ['name', "email", "message"]
    const isValidOperation = updates.every((update) => {
    return allowedTasksUpdates.includes(update)
    })
  
  
    if(!isValidOperation) throw new error.NotFoundError("Property not found")
    updates.forEach(async update => { 
      message[update] = req.body[update]
    })
    
    await message.save()
    res.status(StatusCodes.OK).json({data: message, status : true, message : "Message updated successfully "})

}

async destroy (req, res, next) {
    const message = await Message.findById(req.params.id)
    if(!message) throw new error.BadRequestError("message not found") 

    await message.remove()   


    const data = {
    status : true, message : "message successfully deleted", message
   }
    res.status(StatusCodes.OK).json({data})
}



}




const event = new MessageController()
module.exports = event