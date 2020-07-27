const {
  listContacts,
  addContact,
  getContactById,
  removeContact,
  updateContact,
} = require("../../contacts.js");

// @ GET /api/contacts
// ничего не получает
// вызывает функцию listContacts для работы с json-файлом contacts.json
// возвращает массив всех контактов в json-формате со статусом 200
const getContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    await res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
};

// @ GET /api/contacts/:contactId
// Не получает body
// Получает параметр contactId
// вызывает функцию getById для работы с json-файлом contacts.json
// если такой id есть, возвращает обьект контакта в json-формате со статусом 200
// если такого id нет, возвращает json с ключом "message": "Not found" и статусом 404
const findContactById = async (req, res, next) => {
  try {
    const contactId = Number(req.params.contactId) || req.params.contactId;
    const findedContact = await getContactById(contactId);
    if (findedContact) return await res.status(200).json(findedContact);
    if (!findedContact)
      return await res.status(404).send({ message: "Not found" });
  } catch (err) {
    next(err);
  }
};

// @ POST /api/contacts
// Получает body в формате {name, email, phone}
// Если в body нет каких-то обязательных полей, возарщает json с ключом {"message": "missing required name field"} и статусом 400
// Если с body все хорошо, добавляет уникальный идентификатор в обьект контакта
// Вызывает функцию addContact() для сохранения контакта в файле contacts.json
// По результату работы функции возвращает обьект с добавленным id {id, name, email, phone} и статусом 201
const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const addedContact = await addContact(name, email, phone);
    return await res.status(201).send(addedContact);
  } catch (err) {
    next(err);
  }
};

// @ DELETE /api/contacts/:contactId
// Не получает body
// Получает параметр contactId
// вызывает функцию removeContact для работы с json-файлом contacts.json
// если такой id есть, возвращает json формата {"message": "contact deleted"} и статусом 200
// если такого id нет, возвращает json с ключом "message": "Not found" и статусом 404
const deleteContact = async (req, res, next) => {
  try {
    const contactId = Number(req.params.contactId) || req.params.contactId;
    const removedContact = await removeContact(contactId);

    if (removedContact)
      return await res.status(200).send({ message: "contact deleted" });
    if (!removedContact)
      return await res.status(404).send({ message: "Not found" });
  } catch (err) {
    next(err);
  }
};

// @ PATCH /api/contacts/:contactId
// Получает body в json-формате c обновлением любых полей name, email и phone
// Если body нет, возарщает json с ключом {"message": "missing fields"} и статусом 400
// Если с body все хорошо, вызывает функцию updateContact(id) (напиши ее) для обновления контакта в файле contacts.json
// По результату работы функции возвращает обновленный обьект контакта и статусом 200. В противном случае, возвращает json с ключом "message": "Not found" и статусом 404
const updatingContact = async (req, res, next) => {
  try {
    const contactId = Number(req.params.contactId) || req.params.contactId;
    const { name, email, phone } = req.body;
    if (!name && !email && !phone)
      return await res.status(400).send({ message: "missing fields" });
    const updatedContact = await updateContact(contactId, req.body);
    if (updatedContact) return await res.status(200).json(updatedContact);
    if (!updatedContact)
      return await res.status(404).send({ message: "Not found" });
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
