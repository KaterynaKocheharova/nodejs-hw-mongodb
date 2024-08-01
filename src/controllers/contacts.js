import {
  findContacts,
  findContactById,
  createContact,
  deleteContact,
  upsertContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const findContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  console.log(sortOrder, sortBy);
  const filter = parseFilterParams(req.query);
  const contacts = await findContacts({ page, perPage, sortOrder, sortBy, filter });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts',
    data: contacts,
  });
};

export const findContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await findContactById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).send({
    status: 200,
    message: `Successfully found contact with id ${contactId}`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const newContact = await createContact({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    isFavorite: req.body.isFavorite,
    type: req.body.contactType,
    userId: req.body.userId
  });
  res.status(201).send({
    status: 201,
    message: `Successfully created a new contact`,
    data: newContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContact(contactId);
  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const upsertedContact = await upsertContact(
    contactId,
    {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      isFavorite: req.body.isFavorite,
      type: req.body.contactType,
    },
    {
      upsert: true,
    },
  );
  if (!upsertedContact) {
    throw createHttpError('404', 'Contact not found');
  }
  const status = upsertedContact.isNew ? 201 : 200;
  res.status(status).send({
    status,
    message: 'Successfully upserted the contact',
    data: upsertedContact.contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const patchedContact = await upsertContact(contactId, {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    isFavorite: req.body.isFavorite,
    type: req.body.contactType,
  });
  if (!patchedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).send({
    status: 200,
    message: 'Successfully patched the contact',
    data: patchedContact.contact,
  });
};
