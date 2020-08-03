const { Router } = require("express");

const {
  getContacts,
  findContactById,
  createContact,
  deleteContact,
  updatingContact,
} = require("./contact-controllers.js");

const {
  validateUserCreation,
  validateContactUpdate,
  validateId,
} = require("./contact-req-validation.js");

const contactRouter = Router();

// @ GET /api/contacts
contactRouter.get("/", getContacts);

//GET /contacts?page=1&limit=20
contactRouter.get("/", getContacts);

// @ GET /api/contacts/:contactId
contactRouter.get("/:contactId", validateId, findContactById);

// @ POST /api/contacts
contactRouter.post("/", validateUserCreation, createContact);

// @ DELETE /api/contacts/:contactId
contactRouter.delete("/:contactId", validateId, deleteContact);

// @ PATCH /api/contacts/:contactId
contactRouter.patch(
  "/:contactId",
  validateId,
  validateContactUpdate,
  updatingContact
);

module.exports = contactRouter;
