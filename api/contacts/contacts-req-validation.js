const joi = require("joi");

const validateUserCreation = (req, res, next) => {
  console.log(req.body);

  const contactValidateRules = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    phone: joi.string().required(),
  });

  const result = contactValidateRules.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
};

const validateContactUpdate = (req, res, next) => {
  console.log(req.body);

  const contactValidateRules = joi.object({
    name: joi.string(),
    email: joi.string(),
    phone: joi.string(),
  });

  const result = contactValidateRules.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }
  next();
};

module.exports = { validateUserCreation, validateContactUpdate };
