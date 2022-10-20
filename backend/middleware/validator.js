const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.url');
};

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message('The email field must be a vaild email')
      .messages({ 'string.empty': 'The email field must be filled in' }),
    password: Joi.string().required().min(8).messages({
      'string.min': ' At least 8 characters',
      'string.empty': 'The password field must be filled in',
    }),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .messages({ 'string.empty': 'The email field must be filled in' }),
    password: Joi.string()
      .required()
      .min(8)
      .messages({ 'string.min': ' At least 8 characters' }),
    name: Joi.string().min(2).max(30).messages({
      'string.min': ' At least 2 characters',
      'string.max': ' Max 30 characters',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': ' At least 2 characters',
      'string.max': ' Max 30 characters',
    }),
    avatar: Joi.string()
      .required()
      .custom(validateURL)
      .message('The avatar field must be valid URL'),
  }),
});

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': ' At least 2 characters',
      'string.max': ' Max 30 characters',
    }),
    about: Joi.string().min(2).max(30).messages({
      'string.min': ' At least 2 characters',
      'string.max': ' Max 30 characters',
    }),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL).message('The avatar field must be valid URL'),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.empty': 'The name field must be filled in',
        'string.min': ' At least 2 characters',
        'string.max': ' Max 30 characters',
      }),
    link: Joi.string().required().custom(validateURL).message('Invalid URL'),
  }),
});

module.exports = {
  validateLogin,
  validateCreateUser,
  validateUpdateProfile,
  validateUpdateAvatar,
  validateCreateCard,
};
