import Joi from "joi";

export const courseValidator = (data) => {
    const course = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        author_id: Joi.string().required(),
        category_id: Joi.string()
    });
    return course.validate(data);
}