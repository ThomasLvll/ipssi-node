import {
    Request,
    RequestHandler
} from 'express';
import db from '../db';
import {
        createJWT,
        comparePassword,
        hashPassword
    } from '../modules/auth';


interface TypedRequestParam extends Request {
    body: {
        username?: string;
        password?: string;
    }
}

export const createNewUser: RequestHandler = (req: TypedRequestParam, res) => {
    const { username, password } = req.body;
    if (! username || ! password) {
        return res.status(400).json({ error: 'Invalid body provided.' });
    }
    hashPassword(password)
        .then((hash) => db.user.create({
            data: {
                username,
                password: hash
            }
        }))
        .then((user) => createJWT(user))
        .then((token) => res.status(201).json({ token }));
}

export const getToken: RequestHandler = (req: TypedRequestParam, res) => {
    const { username, password } = req.body;
    if (! username || ! password) {
        return res.status(400).json({ error: 'Invalid body provided.' });
    }
    db.user.findUnique({ where: { username }})
        .then((user) => {
            if (
                ! user ||
                ! comparePassword(password, user.password)
            ) {
                return res.status(401).json({ error: 'Invalid credentials.' });
            }
            const token = createJWT(user);
            res.status(200).json({ token });
        });
};
