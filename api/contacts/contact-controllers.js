const mongoosePaginate = require("mongoose-paginate-v2");

const contactsModel = require("./contact.model.js");

// @ GET /api/contacts
const getContacts = async (req, res, next) => {
  try {
    const options = {
      page: (req.query && req.query.page) || "1",
      limit: (req.query && req.query.limit) || "10",
      sort: { name: 1 },
    };
    console.log("req.query", req.query);
    console.log("req.query.page", req.query.page);
    console.log("req.query.limit", req.query.limit);
    console.log("req.query.sub", req.query.sub);
    let filteredBySubscription = null;

    if (req.query && req.query.sub) {
      filteredBySubscription = { subscription: req.query.sub };
    }

    const paginatedContactsList = await contactsModel.paginate(
      { ...filteredBySubscription },
      ...options
    );
    res.status(200).send(paginatedContactsList);
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
