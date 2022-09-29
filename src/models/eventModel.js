const mongoose = require("mongoose")
const eventSchema = new mongoose.Schema({
  name : String,
  date : Date,
  about : String,
  imagePublicId :String,
  imageSecureUrl : String,
}, { 
    toObject: {
    transform: function (doc, ret) {
      delete ret.image;
    }
  },
  toJSON: {
    transform: function (doc, ret) {
      delete ret.image;
    }
  }
  },{
    timestamps : true
})


module.exports = mongoose.model('event', eventSchema )
