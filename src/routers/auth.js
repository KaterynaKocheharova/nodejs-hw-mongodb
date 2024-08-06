import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrappaer.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema
} from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  logOutController,
  refreshUserSessionController,
  requestResetTokenController,
  resetPasswordController
} from '../controllers/auth.js';

const router = express.Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);
router.post(
  '/login',
  jsonParser,
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);
router.post('/refresh', ctrlWrapper(refreshUserSessionController));
router.post('/logout', ctrlWrapper(logOutController));
router.post(
  '/request-reset-email',
  jsonParser,
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetTokenController),
);
router.post("/reset-password", jsonParser, validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));


export default router;
