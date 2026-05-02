import mongoose from "mongoose";

const Schema = mongoose.Schema;

const institutionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    }
});

const Institution = mongoose.model("Institution", institutionSchema);
export default Institution;