import express from "express";
import mongoose from "mongoose";
import Review from "../models/Review";
import auth, {RequestWithUser} from "../middleware/auth";
import permit from "../middleware/permit";

const reviewsRouter = express.Router();

reviewsRouter.get("/institution/:id", async (req, res, next) => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
        return res.status(400).send({ error: "Invalid institution id" });
    }
    try {
        const reviews = await Review.find({ institution: id })
            .populate("user", "username displayName")
            .sort({ createdAt: -1 });
        res.send(reviews);
    } catch (e) {
        next(e);
    }
});

reviewsRouter.post("/",auth, async (req, res, next) => {
    const { user } = req as RequestWithUser;
    if (!mongoose.Types.ObjectId.isValid(req.body.institution)) return res.status(400).send({ error: "Invalid institution id" });
    try {
        const newReview = new Review({
            institution: req.body.institution,
            user: user._id,
            description: req.body.description,
            ratings: {
                quality: Number(req.body.quality),
                service: Number(req.body.service),
                interior: Number(req.body.interior),
            }
            });
        await newReview.save();
        res.send(newReview);
    }catch (e) {
        if (e instanceof mongoose.mongo.MongoServerError && e.code === 11000) {
            return res.status(400).send({
                error: "You already left a review for this institution"
            });
        }
        if (e instanceof mongoose.Error.ValidationError) {
            return res.status(400).send(e);
        }
        next(e);
    }
});

reviewsRouter.get("/check/:institutionId", auth, async (req, res, next) => {
    const { user } = req as RequestWithUser;
    const { institutionId } = req.params;

    if (!institutionId || !mongoose.Types.ObjectId.isValid(institutionId as string)) {
        return res.status(400).send({ error: "Invalid institution id" });
    }

    try {
        const review = await Review.findOne({
            user: user._id,
            institution: institutionId
        });

        res.send({
            hasReview: !!review
        });

    } catch (e) {
        next(e);
    }
});

reviewsRouter.delete("/:id",auth, permit("admin"), async (req, res, next) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id as string)) {
        return res.status(400).send({ error: "Invalid review id" });
    }

    try {
        const deleted = await Review.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).send({ error: "Review not found" });
        }

        res.send({ message: "Review deleted successfully." });
    } catch (e) {
        next(e);
    }
});

export default reviewsRouter;