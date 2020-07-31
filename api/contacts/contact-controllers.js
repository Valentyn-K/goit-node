const contactsModel = require("./contact.model.js");

// @ GET /api/contacts
const getContacts = async (req, res, next) => {
  try {
    const contacts = await contactsModel.find();
    await res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
};

// @ GET /api/contacts/:contactId
const findContactById = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;

    const findedContact = await contactsModel.findById(contactId);

    if (!findedContact)
      return await res.status(404).send({ message: "Not found" });
    await res.status(200).json(findedContact);
  } catch (err) {
    next(err);
  }
};

// @ POST /api/contacts
const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const addedContact = await contactsModel.create(req.body);
    // const addedContact = await addContact(name, email, phone);
    return await res.status(201).json(addedContact);
  } catch (err) {
    next(err);
  }
};

// @ DELETE /api/contacts/:contactId
const deleteContact = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const removedContact = await contactsModel.findByIdAndDelete(contactId);

    if (!removedContact)
      return await res.status(404).send({ message: "Not found" });
    // if (!removedContact.deletedCount)
    //   return await res.status(404).send({ message: "Not deleted" });

    return await res.status(200).json(removedContact);
  } catch (err) {
    next(err);
  }
};

// @ PATCH /api/contacts/:contactId
const updatingContact = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const { name, email, phone } = req.body;
    if (!name && !email && !phone)
      return await res.status(400).send({ message: "missing fields" });
    const updatedContact = await contactsModel.findByIdAndUpdate(
      contactId,
      { $set: req.body },
      { new: true }
    );
    console.log("updatedContact", updatedContact);
    if (!updatedContact)
      return await res.status(404).send({ message: "Not found" });
    // if (!updatedContact.modifiedCount) {
    //   return res.status(404).send({ message: "Not modified" });
    // }
    return await res.status(200).json(updatedContact);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getContacts,
  findContactById,
  createContact,
  deleteContact,
  updatingContact,
};
