import { model, Schema } from "mongoose";

const courseSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    author_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: "Category",
    },
  
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


courseSchema.virtual('enrollments', {
    ref: 'Enrollment',           
    localField: '_id',           
    foreignField: 'course_id'     
});

const Course = model('Course', courseSchema);
export default Course;
