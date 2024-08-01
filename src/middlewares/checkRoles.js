import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/contacts.js';
import {ObjectId} from "mongodb";

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

  //  ======================== LOGS
  console.log(contactId);
  console.log(user._id);
  console.log(contact);

  if (contact) {
    next();
    return;
  }

  next(createHttpError(403));
};


