import Joi from "joi";

const contactValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
});

const favoriteValidation = Joi.object({
    favorite: Joi.boolean().required(),
})

export { contactValidation, favoriteValidation }