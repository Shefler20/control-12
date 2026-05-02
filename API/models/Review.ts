import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    institution: {
        type: Schema.Types.ObjectId,
        ref: "Institution",
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    ratings: {
        quality: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        service: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        interior: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        }
    }
},{ timestamps: true });

reviewSchema.index({ user: 1, institution: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
