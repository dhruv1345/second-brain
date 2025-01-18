import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Extend the Request interface to include userId
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const middleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send("Authorization header is missing or invalid");
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_PASSWORD) {
        return res.status(500).send("JWT password is not defined");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_PASSWORD) as jwt.JwtPayload;

        if (decoded && decoded.id) {
            req.userId = decoded.id;
            next();
        } else {
            res.status(403).send("Invalid token payload");
        }
    } catch (error) {
        res.status(403).send("Token verification failed");
    }
};
