import {RequestWithUser} from "./auth";
import {NextFunction, Request, Response} from "express";

const permit = (...role: string[]) => {
    return (expressRequest: Request, res: Response, next: NextFunction) => {
        const { user } = expressRequest as RequestWithUser;

        if (!user) return res.status(401).send({message: "Not authorized"});
        if (!role.includes(user.role)) return res.status(403).send({message: "No access, please authenticate"});

        next();
    }
};

export default permit;