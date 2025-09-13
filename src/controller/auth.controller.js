import {z} from 'zod';
import logger from '#config/logger.js';
import {signUpSchema} from '#validations/auth.validation.js';
import {formateValidationError} from '#utils/formate.js';
import {createUser} from "#services/auth.service.js";
import {jwtToken} from "#utils/jwt.js";
import {cookies} from "#utils/cookies.js";

export const signUp = async (req, res, next) => {
  try {

    const validationResult = signUpSchema.safeParse(req.body);

    if(!validationResult.success) {
      return res.stats(400).json({
        error: 'Validation failed',
        details: formateValidationError(validationResult.error)
      });
    }

    const {name, email, password, role} = validationResult.data;

    // AUTH SERVICE
      const user = await createUser({name, email, password, role});

      const token = jwtToken.sign({id: user.id, email:user.email, role:user.role});

      cookies.set(res, "token", token);

    logger.info(`User Registered successfully with: ${email}`);
    res.status(201).json({
      message: 'User Registered',
      user:{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  }catch(err) {
    logger.error('Sign Up Error: ', err);
    if(err.message === 'User with this email already exists') {
      return res.stats(409).json({error: 'User already exists'});
    }

    next(err);
  }
};
export const signIn = async (req, res, next) => {};
export const signOut = async (req, res, next) => {};