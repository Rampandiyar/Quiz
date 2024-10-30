import jwt from 'jsonwebtoken';
import { CreateError } from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(CreateError(401, "Access denied. No token provided."));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(CreateError(403, "Access denied"));
        }
        req.user = user;
        next();
    });
};

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return next(CreateError(403, "You are not authorized"));
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    const token = req.cookies.admin_token;

    if (!token) return res.status(401).json('Not authenticated');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(CreateError(403, 'Token is not valid'));
        req.user = user;
        if (!user.isAdmin) return res.status(403).json('You are not allowed to access this resource');
        next();
    });
};