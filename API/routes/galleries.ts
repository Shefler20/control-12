import express from "express";
import Gallery from "../models/Gallery";
import mongoose from "mongoose";
import auth, {RequestWithUser} from "../middleware/auth";
import {imagesUpload} from "../middleware/multer";
import permit from "../middleware/permit";

const galleriesRouter = express.Router();

galleriesRouter.get("/institution/:id", async (req, res, next) => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
        return res.status(400).send({ error: "Invalid institution id" });
    }
    try {
       const galleries  = await Gallery.find({ institution: id });
       res.send(galleries);
   } catch (e) {
       next(e);
   }
});

galleriesRouter.post("/",auth,imagesUpload.single("image"), async (req, res, next) => {
    const { user } = req as RequestWithUser;
    if (!req.file) return res.status(400).send({ error: "Image is required" });
    if (!mongoose.Types.ObjectId.isValid(req.body.institution)) return res.status(400).send({ error: "Invalid institution id" });
    try {
        const newPhotoGallery = new Gallery({
            institution: req.body.institution,
            user: user._id,
            image: 'images/' + req.file.filename
        });
        await newPhotoGallery.save();
        res.send(newPhotoGallery);
    }catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(e);
        }
        next(e);
    }
});

galleriesRouter.delete("/:id",auth, permit("admin"), async (req, res, next) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
        return res.status(400).send({ error: "Invalid photo id" });
    }

    try {
        const deleted = await Gallery.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).send({ error: "Photo not found" });
        }

        res.send({ message: "Photo deleted successfully." });
    } catch (e) {
        next(e);
    }
});

export default galleriesRouter;