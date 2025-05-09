import Joi from "joi";

export const enrollmentValidator = (data) => {
    const enrollment = Joi.object({
        course_id: Joi.string(),
        user_id: Joi.string()
    });
    return enrollment.validate(data);
}