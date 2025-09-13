import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 12);
  } catch (error) {
    logger.error('Error hashing the password: ', error);
    throw new Error('Error hashing ');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error('Error comparing password: ', error);
    throw new Error('Error validating password');
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    // Check if user exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUsers.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = existingUsers[0];

    // Validate password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Return user without password
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
    logger.info(`User ${user.email} authenticated successfully.`);
    return userWithoutPassword;
  } catch (error) {
    logger.error('Error authenticating user: ', error);
    throw error;
  }
};

export const createUser = async ({ name, email, password, role }) => {
  try {
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUsers.length > 0)
      throw new Error('User with this email already exists');

    const passwordHash = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: passwordHash, role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });

    logger.info(`User ${newUser.email} created successfully.`);
    return newUser;
  } catch (error) {
    logger.error('Creating the user: ', error);
    throw error;
  }
};
