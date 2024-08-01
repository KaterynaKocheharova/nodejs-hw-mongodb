import { ctrlWrapper } from '../utils/ctrlWrappaer.js';
import {
  findContactsController,
  findContactByIdController,
  createContactController,
  deleteContactController,
  upsertContactController,
  patchContactController,
} from '../controllers/contacts.js';
import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  createContactValidationSchema,
  updateContactValidationSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { checkAccess } from '../middlewares/checkRoles.js';

const router = express.Router();
const jsonParser = express.json();

router.use(authenticate);
router.get('/', ctrlWrapper(findContactsController));
router.get('/:contactId',  isValidId, checkAccess, ctrlWrapper(findContactByIdController));
router.post(
  '/',
  jsonParser,
  validateBody(createContactValidationSchema),
  checkAccess,
  ctrlWrapper(createContactController),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactController));
router.put(
  '/:contactId',
  jsonParser,
  isValidId,
  validateBody(updateContactValidationSchema),
  checkAccess,
  ctrlWrapper(upsertContactController),
);
router.patch(
  '/:contactId',
  jsonParser,
  isValidId,
  validateBody(updateContactValidationSchema),
  checkAccess,
  ctrlWrapper(patchContactController),
);

export default router;
