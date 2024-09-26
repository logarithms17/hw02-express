import Contact from "../models/contactModel.js";
import { contactValidation, favoriteValidation } from "../validation/validation.js";

//GETTING THE CONTACTS
export const getAllContacts = async (_req, res, next) => {
    try {
        const contacts = await Contact.find(); //fetches all the data from the contact database
        
        res.status(200).json(contacts);
    } catch (error) {
        next(error)
    }
};

//GETTING SPECIFIC CONTACT BY ID
export const getContactById = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.contactId);
        if (!contact) {
            return res.status(404).json({ message: 'Not found' });
        }
        res.result(200).json(contact);
    } catch (error) {
        next(error)
    }
};

//ADDING CONTACT TO THE DATABASE

export const addContact = async (req, res, next) => {

    const { error } =contactValidation.validate(req.body) //this will validate if the input data is the same as required in our Joi validation
    
    if (error) {
        return res.status(400).json({ message: "Missing required field" });
    }
    
    try {
        const result = Contact.create(req.body) //this will create the data and save to Contact collection Database
        res.status(201).json(result);
    } catch (error) {
        next(error)
    }
}

//DELETE CONTACT DETAIL
export const deleteContact = async (req, res, next) => {
    try {
        const result = await Contact.findByIdAndDelete(req.params.contactId);
        if (!result) {
            return res.status(404).json({ message: 'Not found' });
        }
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

//UPDATE CONTACT DETAILS
export const updateContact = async (req, res, next) => {
    const { error } = contactValidation.validate(req.body)
    
    if (error) {
        return res.status(400).json({ message: "Missing required field" });
    }
    
    try {
        const result = await Contact.findByIdAndUpdate(req.params.contactId, req.body, { new: true });
        if (!result) {
            return res.status(404).json({ message: 'Not found' });
        }
        
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}
