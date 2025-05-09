import Joi from "joi";

export const categoryValidator = (data) => {
    const category = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        description: Joi.string().required()
    });
    return category.validate(data);
}