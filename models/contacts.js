import fs from "fs/promises"
import path from "path"
import { nanoid } from "nanoid"
import {fileURLToPath} from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const contactsPath = path.join(__dirname, "contacts.json")

const listContacts = async () => {
  const data = await fs.readFile(contactsPath)
  return JSON.parse(data)
}

const getContactById = async (contactId) => {
  const contacts = await listContacts()
  const result = contacts.find((contact) => contact.id === contactId)
  if (!result) {
    return null
  }
  return result
}

const removeContact = async (contactId) => {
  const contacts = await listContacts()
  const index = contacts.findIndex((contact) => contact.id === contactId)
  if (index === -1) {
    return null
  }
  const [result] = contacts.splice(index, 1)
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return result
}

const addContact = async ({ name, email, phone }) => {
  const contacts = await listContacts()
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  }
  contacts.push(newContact)
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return newContact
}

const updateContact = async (contactId, {name, email, phone}) => {
  const contacts = await listContacts()
  const index = contacts.findIndex((contact) => contact.id === contactId)
  if (index === -1) {
    return null
  }
  contacts[index] = {
    id: contactId,
    name,
    email,
    phone
  }
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return contacts[index]
}

export { listContacts, getContactById, removeContact, addContact, updateContact }