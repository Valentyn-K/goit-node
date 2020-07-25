const fs = require("fs");
const path = require("path");
const { promises: fsPromises } = fs;
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  try {
    const contacts = await fsPromises.readFile(contactsPath);

    const parseContacts = JSON.parse(contacts);

    console.table(parseContacts);
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  try {
    // console.log("was", listContacts());

    const contacts = await fsPromises.readFile(contactsPath);

    const parseContacts = JSON.parse(contacts);

    const filteredContacts = parseContacts.filter(
      (contact) => contact.id === contactId
    );

    console.table(filteredContacts);
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await fsPromises.readFile(contactsPath);

    const parseContacts = JSON.parse(contacts);

    const filteredContacts = parseContacts.filter(
      (contact) => contact.id !== contactId
    );

    fsPromises.writeFile(contactsPath, JSON.stringify(filteredContacts));

    listContacts();
  } catch (error) {
    console.log(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const oldContactsArr = await fsPromises.readFile(contactsPath);

    const parseContacts = JSON.parse(oldContactsArr);

    const newContact = { id: uuidv4(), name, email, phone };

    const newContactsArr = [...parseContacts, newContact];

    fsPromises.writeFile(contactsPath, JSON.stringify(newContactsArr));

    listContacts();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
