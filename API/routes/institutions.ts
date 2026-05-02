import express from "express";
import Institution from "../models/Institution";
import Review from "../models/Review";
import Gallery from "../models/Gallery";
import auth, {RequestWithUser} from "../middleware/auth";
import {imagesUpload} from "../middleware/multer";
import mongoose from "mongoose";
import permit from "../middleware/permit";

const institutionsRouter = express.Router();

institutionsRouter.get("/", async (_req, res, next) => {
    try {
        const institutions = await Institution.find().populate("user" ,"username displayName role");

        const result = await Promise.all(
            institutions.map(async (inst) => {
                const [reviews, photosCount] = await Promise.all([
                    Review.find({ institution: inst._id }),
                    Gallery.countDocuments({ institution: inst._id })
                ]);

                const reviewsCount = reviews.length;

                let avgRating = 0;

                if (reviewsCount > 0) {
                    const sum = reviews.reduce((acc, r) => {
                        const quality = r.ratings?.quality ?? 0;
                        const service = r.ratings?.service ?? 0;
                        const interior = r.ratings?.interior ?? 0;

                        return acc + (quality + service + interior);
                    }, 0);

                    avgRating = sum / (reviewsCount * 3);
                }

                return {
                    ...inst.toObject(),
                    reviewsCount,
                    photosCount,
                    avgRating
                };
            })
        );

        res.send(result);
    } catch (error) {
        next(error);
    }
});

institutionsRouter.post("/", auth, imagesUpload.single("image"), async (req, res, next) => {
    const { user } = req as RequestWithUser;
    if (!req.file) return res.status(400).send({ error: "Image is required" });
    const { title, description, agreeToTerms  } = req.body;
    const isAgreed = String(agreeToTerms) === "true";
    if (!isAgreed) {
        return res.status(400).send({ error: "You must agree to the terms" });
    }
    try {
        const newInstitution = new Institution({
            user: user._id,
            title: title,
            description: description,
            image: 'images/' + req.file.filename,
        });
        await newInstitution.save();
        res.send(newInstitution);
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(e);
        }
        next(e);
    }
});

institutionsRouter.get("/:id", async (req, res, next) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
        return res.status(400).send({ error: "Invalid institution id" });
    }

    try {
        const institution = await Institution.findById(id)
            .populate("user", "username displayName role");

        if (!institution) {
            return res.status(404).send({ error: "Institution not found" });
        }

        const [reviews, photosCount] = await Promise.all([
            Review.find({ institution: institution._id }),
            Gallery.countDocuments({ institution: institution._id })
        ]);

        const reviewsCount = reviews.length;

        let avgQuality = 0;
        let avgService = 0;
        let avgInterior = 0;
        let avgRating = 0;

        if (reviewsCount > 0) {
            let sumQuality = 0;
            let sumService = 0;
            let sumInterior = 0;

            reviews.forEach(r => {
                sumQuality += r.ratings?.quality ?? 0;
                sumService += r.ratings?.service ?? 0;
                sumInterior += r.ratings?.interior ?? 0;
            });

            avgQuality = sumQuality / reviewsCount;
            avgService = sumService / reviewsCount;
            avgInterior = sumInterior / reviewsCount;

            avgRating = (avgQuality + avgService + avgInterior) / 3;
        }

        return res.send({
            ...institution.toObject(),
            reviewsCount,
            photosCount,
            avgQuality,
            avgService,
            avgInterior,
            avgRating
        });

    } catch (e) {
        next(e);
    }
});

institutionsRouter.delete("/:id", auth, permit("admin"), async (req, res, next) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
        return res.status(400).send({ error: "Invalid institution id" });
    }

    try {
        await Promise.all([
            Gallery.deleteMany({ institution: id }),
            Review.deleteMany({ institution: id }),
            Institution.findByIdAndDelete(id)
        ]);

        res.send({ message: "Institution deleted successfully." });

    } catch (e) {
        next(e);
    }
});

export default institutionsRouter;