import Joi from "joi"

export const reviewValidation = (data) => {
    const review = Joi.object({
        rating: Joi.string().required(),
        commet: Joi.string().required(),
        user_id: Joi.string().required(),
        course_id: Joi.string().required()
    });
    return review.validate(data);
}