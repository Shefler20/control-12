import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gallerySchema = new Schema({
    institution: {
        type: Schema.Types.ObjectId,
        ref: "Institution",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
});

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;