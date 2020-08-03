const joi = require("joi");
const {
  Types: { ObjectId },
} = require("mongoose");

const validateRegistration = (req, res, next) => {
  const validationRules = joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
    subscription: joi.string(),
  });

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
};

const validateLogin = (req, res, next) => {
  const validationRules = joi.object({
    email: joi.string().required(),
    password: joi.string().required(),
  });

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
};

const validateId = (req, res, next) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send();
  }
  next();
};

const validateUpdateSubscription = (req, res, next) => {
  const validationRules = joi.object({
    subscription: joi.string().required().valid("free", "pro", "premium"),
  });

  const validationResult = validationRules.validate(req.body);

  if (validate.error) {
    return res.status(400).send(validate.error);
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateId,
  validateUpdateSubscription,
};
