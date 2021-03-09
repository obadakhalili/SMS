import Joi from "joi"

const userAddition = Joi.object({
  name: Joi.string().max(50).required().messages({
    "string.max": "Name cannot be more than 50 characters long",
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  dob: Joi.date().iso().required().messages({
    "any.required": "Date of birth is required",
    "date.format": "Date of birth must be in ISO format (YYYY-MM-DD)",
  }),
  gpa: Joi.number().min(0).max(4).required().messages({
    "number.min": "GPA can't be less than 0",
    "number.max": "GPA can't be more than 4",
    "any.required": "GPA is required",
  }),
})

const userUpdation = Joi.object({
  name: Joi.string().max(50).messages({
    "string.max": "Name cannot be more than 50 characters long",
    "string.empty": "Name is required",
  }),
  dob: Joi.date().iso().messages({
    "date.format": "Date of birth must be in ISO format (YYYY-MM-DD)",
  }),
  gpa: Joi.number().min(0).max(4).messages({
    "number.min": "GPA can't be less than 0",
    "number.max": "GPA can't be more than 4",
  }),
})

export default { userAddition, userUpdation }
