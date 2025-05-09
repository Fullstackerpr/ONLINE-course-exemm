import { model, Schema } from "mongoose";

const reviewSchema = new Schema({
    rating: {
        type: String,
        enum: ['very_bad', 'bad', 'average', 'good', 'excellent']
    },
    commet: {
        type: String, 
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    course_id: {
        type: Schema.Types.ObjectId,
        ref: "Course",
    },
}, {
    timestamps: true
});



const Review = model('Review', reviewSchema);
export default Review;