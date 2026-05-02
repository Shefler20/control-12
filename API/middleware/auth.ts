import {NextFunction, Request, RequestHandler, Response} from "express";
import {HydratedDocument} from "mongoose";
import {UserFields} from "../types";
import User from "../models/User";
import jwt, {TokenExpiredError} from "jsonwebtoken";
import config from "../config";


export interface RequestWithUser extends Request {
    user: HydratedDocument<UserFields>;
}

const auth: RequestHandler = async (ExpressReq: Request, res: Response, next: NextFunction) => {
    try {
        const req = ExpressReq as RequestWithUser;

        const jwtToken = req.cookies.accessToken;

        if (!jwtToken) return res.status(401).send({message: 'No access token provided'});

        const decoded = jwt.verify(jwtToken, config.jwtSecret) as {_id: string};

        const user = await User.findOne({_id: decoded._id});

        if (!user) return res.status(401).send({message: 'Invalid access token'});

        req.user = user;
        next();
    }catch (e) {
        if (e instanceof TokenExpiredError) {
            return res.status(401).send({message: 'Token expired'});
        }
        res.status(401).send({message: 'Please Authenticate'});
    }
};

export default auth;