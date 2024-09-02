import express from "express"
import { listContacts, getContactById, removeContact, addContact, updateContact } from "../../models/contacts.js"
import schema from "../../validation/validation.js"

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts()
    console.log(contacts)
    res.json(contacts)
  } catch (error) {
    next(error)
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const contact = await getContactById(contactId)
    if (!contact) {
      return res.status(404).json({ message: 'Not found' })
    }
    res.json(contact)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    console.log(req.body)
    const { name, email, phone } = req.body
    const newContact = await addContact({ name, email, phone })
    res.status(201).json(newContact)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const deletedContact = await removeContact(contactId)
    if (!deletedContact) {
      return res.status(404).json({ message: 'Not found' })
    }
    res.json(deletedContact)
  } catch (error) {
    next(error)
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const { name, email, phone } = req.body
    const updatedContact = await updateContact(contactId, { name, email, phone })
    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' })
    }
    res.json(updatedContact)
  } catch (error) {
    next(error)
  }
})

export default router
