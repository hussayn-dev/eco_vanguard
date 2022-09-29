const mongoose = require("mongoose")
const projectSchema = new mongoose.Schema({
    name : String,
    timeCreated : Date,
   beneficiary : String,
   imagePublicId :String,
   imageSecureUrl : String,
   type : {
    type : "String",
    enum : [ "ongoing", "executed", "next"]
   },
   about : String
},{ 
    toObject: {
    transform: function (doc, ret) {
      delete ret.password;
    }
  },
  toJSON: {
    transform: function (doc, ret) {
      delete ret.password;
    }
  }
  } , {
    timestamps : true
})


module.exports = mongoose.model('Project', projectSchema )