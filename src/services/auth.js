import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { createSession } from './utils.js';

// ======================================= REGISTER
export const registerUser = async (userData) => {
  const alreadyExistingUser = await UsersCollection.findOne({
    email: userData.email,
  });
  if (alreadyExistingUser !== null) {
    throw createHttpError(409, 'User with this email already exists');
  }
  const encryptedPassword = await bcrypt.hash(userData.password, 10);
  return UsersCollection.create({ ...userData, password: encryptedPassword });
};

// ========================================= LOGIN
export const loginUser = async (userData) => {
  const user = await UsersCollection.findOne({
    email: userData.email,
  });
  if (user === null) {
    throw createHttpError(404, 'User with the give email not found.');
  }
  const isCorrectPassowrd = await bcrypt.compare(
    userData.password,
    user.password,
  );
  if (!isCorrectPassowrd) {
    throw createHttpError(404, 'Anauthorized. Incorrect password');
  }

  SessionsCollection.deleteOne({
    sessionId: user._id,
  });

  const newSession = createSession(user._id);
  return await SessionsCollection.create(newSession);
};

// ===================================== LOGOUT

export const logOut = (sessionId) =>
  SessionsCollection.deleteOne({ sessionId });

// =================================== REFRESH

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  const isRefreshTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isRefreshTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession(sessionId); // Use the correct sessionId
  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken,
  });

  return await SessionsCollection.create(newSession);
};
