const mongoose = require("mongoose")
// const validator = require("validator")

const profileSchema = new mongoose.Schema({
  fullName : {
    type : String
  },
   age  : { type : Number}, 
  activeMedia : {  type : String},
  institution : {type : String} ,
  type : {
    type : String,
    enum : ["institution", "secondary", "school"]
  },
  cityOfResidence : String,
  faculty : { type : String}, 
  department : {    type : String},
  level : {type : String},
  schoolName : String,
  schoolLocation : String,
  studentClass : String,
  yearOfAdmission : {type :  String},
  yearOfGraduation : {type : String},
  owner : {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref : "User"
  }  
})

profileSchema.pre('save', async function (done) {
  if(this.isModified('fullName')) {
      await this.populate("owner")
       this.owner.fullName = this.fullName
       this.owner.save()
  }
  done()
})


module.exports = mongoose.model("Profile", profileSchema)


