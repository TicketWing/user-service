import Joi from "joi";
import { ValidationRegExps } from "../consts/validation.const";

export const LoginAndInitialStepSchema = Joi.object({
  email: Joi.string().trim().regex(ValidationRegExps.email).required(),
  password: Joi.string().trim().regex(ValidationRegExps.password).required(),
});

export const FinalStepSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .pattern(/^[A-Z][a-z]*$/)
    .required(),
  age: Joi.number().positive().min(15).required(),
});

