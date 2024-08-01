import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/contacts.js';

export const checkAccess = async (req, res, next) => {
  const { user } = req;

  if (!user) {
    next(createHttpError(401));
    return;
  }

  const { contactId } = req.params;

  if (!contactId) {
    next(createHttpError(403));
    return;
  }

  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId: user._id,
  });

  console.log(contact);

  next();

  if (contact) {
    next();
    return;
  }

  next(createHttpError(403));
};
