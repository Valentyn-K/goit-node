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

    return parseContacts;
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await fsPromises.readFile(contactsPath);

    const parseContacts = JSON.parse(contacts);

    const findedContact = await parseContacts.find(
      (contact) => contact.id === contactId
    );

    console.table(findedContact);

    return findedContact;
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
    const deletedContact = parseContacts.find(
      (contact) => contact.id === contactId
    );
    console.log("filteredContacts", filteredContacts);
    await fsPromises.writeFile(contactsPath, JSON.stringify(filteredContacts));

    return deletedContact;
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

    await fsPromises.writeFile(contactsPath, JSON.stringify(newContactsArr));

    listContacts();
    return newContact;
  } catch (error) {
    console.log(error);
  }
}

async function updateContact(contactId, reqData) {
  const oldContactsArr = await fsPromises.readFile(contactsPath);
  const parseContacts = JSON.parse(oldContactsArr);
  const findedContactIndex = await parseContacts.findIndex(
    (contact) => contact.id === contactId
  );
  console.log("findedContactIndex", findedContactIndex);
  parseContacts[findedContactIndex] = {
    ...parseContacts[findedContactIndex],
    ...reqData,
  };
  // console.log("updatedContact", updatedContact);
  const updatedContactsArr = [...parseContacts];
  console.log("updatedContactsArr", updatedContactsArr);

  await fsPromises.writeFile(contactsPath, JSON.stringify(updatedContactsArr));
  // console.log(updatedContact);
  return parseContacts[findedContactIndex];
}

// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// };
