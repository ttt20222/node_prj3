import Joi from 'joi';

export const createUser = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
  passwordConfirm: Joi.string().required().min(6),
  name: Joi.string().required(),
});

export const loginUser = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(6),
});

export const createResume = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required().min(150),
});

export const updateResumeJoi = Joi.object({
  title: Joi.string(),
  content: Joi.string().min(150),
});

export const updateStatus = Joi.object({
  status: Joi.string()
    .valid('APPLY', 'DROP', 'PASS', 'INTERVIEW1', 'INTERVIEW2', 'FINAL_PASS')
    .required(),
  reason: Joi.string().required(),
});
