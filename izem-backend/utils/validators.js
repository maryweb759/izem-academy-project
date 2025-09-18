const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .pattern(/^[A-Za-z\s]+$/)
      .min(3)
      .max(20)
      .required(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    password: Joi.string().min(6).required(),
    city: Joi.string().required(),
    courses: Joi.array().items(Joi.string().hex().length(24)), // MongoDB ObjectIds
    role: Joi.string().valid("student", "teacher", "admin").optional() // <-- make it optional
  });

  return schema.validate(data);
};

module.exports = { registerValidation };
