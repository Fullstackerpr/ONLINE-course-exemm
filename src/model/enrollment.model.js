import { model, Schema } from "mongoose";

const enrollmentSchema = new Schema({
    course_id: {
        type: Schema.Types.ObjectId,
        ref: "Course",
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true});

const Enrollment = new model('Enrollment', enrollmentSchema);
export default Enrollment;