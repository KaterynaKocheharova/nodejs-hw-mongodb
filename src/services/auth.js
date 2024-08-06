// src/services/auth


import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMPLATES_DIR } from '../constants/index.js';
import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import { createSession } from './utils.js';



// ======================================= REGISTER
export const registerUser = async (userData) => {
  const alreadyExistingUser = await User.findOne({ email: userData.email });
  if (alreadyExistingUser !== null) {
    throw createHttpError(409, 'Email in use');
  }
  const encryptedPassword = await bcrypt.hash(userData.password, 10);
  return User.create({ ...userData, password: encryptedPassword });
};

// ========================================= LOGIN

export const loginUser = async (userData) => {
  const user = await User.findOne({
    email: userData.email,
  });
  if (!user) {
    throw createHttpError(401, 'User with the give email not found.');
  }
  const isCorrectPassowrd = await bcrypt.compare(
    userData.password,
    user.password,
  );
  if (!isCorrectPassowrd) {
    throw createHttpError(401, 'Incorrect password');
  }

  Session.deleteOne({
    userId: user._id,
  });

  const newSession = createSession(user._id);
  return await Session.create(newSession);
};

// =================================== REFRESH

export const refreshUsersSession = async ({ refreshToken, userId }) => {
  const session = await Session.findOne({
    userId,
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

  const newSession = createSession(session.userId);
  await Session.deleteOne({
    _id: userId,
    refreshToken,
  });

  return await Session.create(newSession);
};

// ===================================== LOGOUT

export const logOut = (sessionId) => Session.deleteOne({ _id: sessionId });

// ==================================== RESET PASSWORD

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    { expiresIn: '15m' },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};
