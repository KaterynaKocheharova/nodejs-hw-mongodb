import {
  registerUser,
  loginUser,
  logOut,
  refreshUsersSession,
  requestResetToken,
} from '../services/auth.js';
import { setupCookies } from './utils.js';
import { resetPassword } from '../services/auth.js';

// ========================================== REGISTER

export const registerUserController = async (req, res) => {
  const { name, email, password } = req.body;
  const userData = {
    name,
    email,
    password,
  };

  const createdUser = await registerUser(userData);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered the user',
    data: createdUser,
  });
};

// ======================================= LOGIN

export const loginUserController = async (req, res) => {
  const { email, password } = req.body;
  const userData = {
    email,
    password,
  };
  const session = await loginUser(userData);

  setupCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in the user',
    data: {
      accessToken: session.accessToken,
    },
  });
};

// ============================== REFRESH

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    userId: req.cookies.userId,
    refreshToken: req.cookies.refreshToken,
  });

  setupCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed the session',
    data: {
      accessToken: session.accessToken,
    },
  });
};

// =============================== LOGOUT

export const logOutController = async (req, res) => {
  const { userId } = req.cookies;
  if (userId) {
    await logOut(userId);
  }

  res.clearCookie('userId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

// ============================= REQUEST PASSWORD RESET

export const requestResetTokenController = async (req, res) => {
  const email = req.body.email;
  await requestResetToken(email);

  res.status(200).json({
    message: 'Reset password email was successfully sent',
    status: 200,
    data: {},
  });
};

// ============================ PASSWORD RESET

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.status(200).json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};
