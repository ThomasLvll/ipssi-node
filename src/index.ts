import dayjs from 'dayjs';
import express from 'express';
import db from './db';
import * as userHandler from './handlers/user';
import { protect } from './modules/auth';


(async () => {
    (await import('dotenv')).config();
    const {
        SERVER_PORT,
        DB_URL,
    } = process.env;

    const app =
        express()
            .use(
                express.urlencoded({ extended: true }),
                express.json(),
                express.static('public'),
                (req, res, next) => {
                    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS Z')}] ${req.method} - ${req.url} - ${req.ip}`);
                    next();
                }
            );
    
    app.get('/ping', (req, res) => {
        res.status(200).send('pong');
    });

    app.use(
        '/api',
        protect,
        [
            (await import('./routes/user')).default,
            (await import('./routes/todo')).default
        ]
    );

    app.use('/signup', userHandler.createNewUser);

    app.use('/login', userHandler.getToken);

    app.listen(SERVER_PORT, () => {
        console.log(`Server listening on port ${SERVER_PORT}.`);
    });
})();
