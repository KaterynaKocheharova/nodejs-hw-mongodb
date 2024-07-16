import { findContacts, findContactById, createContact, deleteContact } from '../services/contacts.js';
import createHttpError from 'http-errors';

export const findContactsController = async (req, res) => {
  const contacts = await findContacts();
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
  const contact = await createContact(req.body);

  res.status(201).send({
    status: 201,
    message: `Successfully created a new contact`,
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const {contactId} = req.params;
  const contactToDelete = await deleteContact(contactId);
  if(!contactToDelete) {
    throw createHttpError(404, "Contact not found");
  };
  res.status(204).send({
    status: 201,
    message: `Successfully deleted the contact`,
    data: contactToDelete,
  });
};
