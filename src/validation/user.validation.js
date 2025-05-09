import Joi from "joi";

export const userValidator = (data) => {
    const user = Joi.object({
        fullName: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(6).max(50).required(),
        password: Joi.string().min(4).max(20).required(),
    });
    return user.validate(data);
};