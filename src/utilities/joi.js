const Joi = require("joi");

const validate = (schema, payload) => {
  const { error } = schema.validate(payload);
  if (error) {
    let message = error.details[0].message;
    message = message.replace(/"/g, "");
    message = message[0].toUpperCase() + message.substr(1);
    return message;
  } else return "";
};

const userSchema = Joi.object({
  fullName: Joi.string().alphanum().min(3).max(30),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),

  confirmPassword: Joi.ref("password"),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

const eventSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),

  about: Joi.string().alphanum().min(3).max(300),
  //date
});
const projectSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),

  beneficiary: Joi.string().alphanum().min(3).max(30),

  about: Joi.string().alphanum().min(3).max(300),
  //type
});
const messageSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),

  message: Joi.string().alphanum().min(3).max(300),
});
//, activemedia,,,level
//,,studentClass,

const profileSchema = Joi.object({
  fullName: Joi.string().alphanum().min(3).max(30),

  schoolName: Joi.string().alphanum().min(3).max(30),

  institution: Joi.string().alphanum().min(3).max(30),

  cityOfResidence: Joi.string().alphanum().min(3).max(30),

  schoolLocation: Joi.string().alphanum().min(3).max(30),

  department: Joi.string().alphanum().min(3).max(30),

  faculty: Joi.string().alphanum().min(3).max(30),

  age: Joi.number().integer().min(12).max(100),

  yearOfAdmision: Joi.number().integer().min(1900).max(2013),

  yearOfGraduation: Joi.number().integer().min(1900).max(2013),
});

module.exports = {
  validate,
  eventSchema,
  profileSchema,
  projectSchema,
  messageSchema,
  userSchema,
};

// access_token: [
//     Joi.string(),
//     Joi.number()
// ],

// birth_year: Joi.number()
//     .integer()
//     .min(1900)
//     .max(2013),
