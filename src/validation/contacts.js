import Joi from 'joi';

export const createContactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Number should be a string',
    'string.min': 'Number should have at least {#limit} characters',
    'string.max': 'Number should have at most {#limit} characters',
    'any.required': 'Number is required',
  }),
  email: Joi.string().email().messages({
    'string.base': 'Email should be a string',
  }),
  isFavourite: Joi.boolean().messages({
    'string.base': 'isFavorite should be a string',
  }),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'any.only': 'Contact should be of type work, home, or personal',
  }),
  photo: Joi.string().messages({
    string: 'Photo should be a string',
  }),
});

export const updateContactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base': 'Number should be a string',
    'string.min': 'Number should have at least {#limit} characters',
    'string.max': 'Number should have at most {#limit} characters',
    'any.required': 'Number is required',
  }),
  email: Joi.string().email().messages({
    'string.base': 'Email should be a string',
  }),
  isFavourite: Joi.boolean().messages({
    'string.base': 'isFavorite should be a string',
  }),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'any.only': 'Contact should be of type work, home, or personal',
  }),
  photo: Joi.string().allow("").messages({
    string: 'Photo should be a string',
  }),
});
