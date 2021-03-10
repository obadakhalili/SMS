import Joi from "joi"

const shared = {
  name: Joi.string().max(50).messages({
    "string.max": "Name cannot be more than 50 characters long",
    "string.empty": "Name cannot be empty",
  }),
  dob: Joi.date().iso().messages({
    "date.format": "Date of birth must be in ISO format (YYYY-MM-DD)",
  }),
  gpa: Joi.number().min(0).max(4).messages({
    "number.min": "GPA can't be less than 0",
    "number.max": "GPA can't be more than 4",
  }),
}

const userAddition = Joi.object({
  name: shared.name.required().messages({ "any.required": "Name is required" }),
  dob: shared.dob
    .required()
    .messages({ "any.required": "Date of birth is required" }),
  gpa: shared.gpa.required().messages({ "any.required": "GPA is required" }),
})

const userUpdation = Joi.object({
  name: shared.name,
  dob: shared.dob,
  gpa: shared.gpa,
})

export default { userAddition, userUpdation }
