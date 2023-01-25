import db from '../db';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import * as CryptoJS from 'crypto-js';
import * as bcrypt from 'bcrypt';


export const createJWT = (user: User) => {
    const token = jwt.sign(
        { sub: user.id },
        <string>process.env.TOKEN_SECRET
    );
    return token;
};

export const protect: RequestHandler = (req, res, next) => {
    const [, token] = (req.headers.authorization || '').split('Bearer ');
    if (! token) {
        return res.status(401).send();
    }

    jwt.verify(token, <string>process.env.TOKEN_SECRET, async (error, decoded) => {
        if (error) {
            return res.status(401).json({ error: 'Invalid token.' });
        }
        req['user'] = await db.user.findUnique({ where: { id: <string>decoded?.sub } }) || undefined;
        console.log(`Authenticated user: ${req.user?.username} (id: ${req.user?.id})`)
        return next();
    });
};

export const comparePassword = (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
}

export const hashPassword = (password: string) => {
    return bcrypt.hash(password, 10);
}
