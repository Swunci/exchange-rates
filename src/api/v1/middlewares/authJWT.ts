import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authenticateJWT = (req: Request, res: Response, next: any) => {
    const token: string = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            responseMessage: 'Unauthorized'
        });
    }
    jwt.verify(token, process.env.API_SECRET!, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                responseMessage: 'Unauthorized'
            });
        }
        req.body.userId = (decoded as JwtPayload).id;
        next();
    });
};