import express from "express";
import mongoose from "mongoose";
import User from "../models/User";
import {OAuth2Client} from "google-auth-library";
import config from "../config";
import {imagesUpload} from "../middleware/multer";
import jwt from "jsonwebtoken";

const usersRouter = express.Router();

const createAccessToken = (userID: string) => {
    return jwt.sign({_id: userID}, config.jwtSecret, {expiresIn: '1h'});
};

const createRefreshToken = (userID: string) => {
    return jwt.sign({_id: userID}, config.refreshSecret, {expiresIn: '7d'});
};

usersRouter.post("/", imagesUpload.single("image"), async (req, res,next) => {
    const existingUser = await User.findOne({username: req.body.username});
    if (existingUser) return res.status(400).send({
        errors: {
            username: {
                message: "User already exists",
            },
        },
    });
    try {
       const newUser = new User({
           username: req.body.username,
           password: req.body.password,
           displayName: req.body.displayName,
           avatar: req.file ? "images/" + req.file.filename : null,
       });
       newUser.token = createRefreshToken(newUser._id.toString());
        const saveUser = await newUser.save();

        res.cookie("refreshToken", saveUser.token,
            {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

        res.cookie("accessToken", createAccessToken(saveUser._id.toString()),
            {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

        res.send(saveUser);
   } catch (e) {
       if (e instanceof mongoose.Error.ValidationError) {
           return res.status(400).send(e);
       }
       next(e);
   }
});


usersRouter.post("/google", async (req, res,next) => {
    try {
        if (!req.body.credential) return res.status(400).send({message: "Credential required"});
        const client = new OAuth2Client(config.clientID);

        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: config.clientID
        });

        const payload = ticket.getPayload();

        if (!payload) return res.status(400).send({message: "Invalid Credential"});

        const email = payload.email;
        const displayName = payload.name;
        const avatar = payload.picture;
        const id = payload.sub;

        if (!email) return res.status(400).send({message: "Not enough email address of google"});

        let user = await User.findOne({googleID: id});

        if (!user) {
            user = new User({
                username: email,
                googleID: id,
                displayName,
                avatar,
                password: crypto.randomUUID()
            });
        }
        user.token = createRefreshToken(user._id.toString());
        const saveUser = await user.save();

        res.cookie("refreshToken", saveUser.token,
            {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

        res.cookie("accessToken", createAccessToken(saveUser._id.toString()),
            {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        res.send({message: "Successfully logged with Google", saveUser});
    }catch (e) {
        next(e);
    }
});

usersRouter.post("/sessions", async (req, res,next) => {
    try{
        const user = await User.findOne({username: req.body.username});

        if (!user) return res.status(400).send({message:"User does not exist"});

        const isMatch = await user.checkPassword(req.body.password);

        if (!isMatch) return res.status(400).send({message:"Invalid password"});

        user.token = createRefreshToken(user._id.toString());
        const saveUser = await user.save();

        res.cookie("refreshToken", saveUser.token,
            {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

        res.cookie("accessToken", createAccessToken(saveUser._id.toString()),
            {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        res.send({message:"Session created", user});
    }catch(e){
        next(e);
    }
});

usersRouter.delete('/sessions', async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const user = await User.findOne({token: refreshToken});

            if (user) {
                user.token = '';
                await user.save();
            }
        }
    }catch(e){
        next(e);
    }

    res.clearCookie("refreshToken",
        {
            httpOnly: true,
            sameSite: "strict",
        });

    res.clearCookie("accessToken",
        {
            httpOnly: true,
            sameSite: "strict",
        });

    res.send({message:"Session deleted"});
});

usersRouter.post('/token', async (req, res,next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) return res.status(401).send({message: "Refresh token not provided"});

        const decoded = jwt.verify(refreshToken, config.refreshSecret) as {_id: string};

        const user = await User.findOne({_id: decoded._id, token: refreshToken});

        if (!user) return res.status(401).send({message: "Invalid refresh token provided"});

        const accessToken = createAccessToken(user._id.toString());

        res.cookie("accessToken", accessToken,
            {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

        res.send({message:"Token updated"});
    } catch (e) {
        res.status(401).send({message: 'Invalid token'});
    }
});

export default usersRouter;