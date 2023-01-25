"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("node:fs"));
const node_crypto_1 = require("node:crypto");
const dayjs = __importStar(require("dayjs"));
const express = __importStar(require("express"));
(async () => {
    (await Promise.resolve().then(() => __importStar(require('dotenv')))).config();
    const { SERVER_PORT, DB_PATH, } = process.env;
    const db = fs.existsSync(DB_PATH)
        ? JSON.parse(fs.readFileSync(DB_PATH, { encoding: 'utf8' }))
        : { users: [] };
    const saveDb = () => {
        fs.writeFile(DB_PATH, JSON.stringify(db), (error) => {
            if (error) {
                console.error(error);
            }
            else {
                console.log('Database saved.');
            }
        });
    };
    const app = express()
        .use(express.urlencoded({ extended: true }))
        .use(express.json())
        .use(express.static('public'))
        .use((req, res, next) => {
        console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS Z')}] ${req.method} - ${req.url} - ${req.ip}`);
        next();
    });
    app.get('/users', (req, res) => {
        res.status(200).json({ users: db.users });
    });
    app.post('/user', (req, res) => {
        const user = {
            id: (0, node_crypto_1.randomUUID)(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
            gender: req.body.gender,
            birthDate: new Date(req.body.birthDate)
        };
        db.users.push(user);
        saveDb();
        res.status(201).json({ user });
    });
    app.put('/user/:id', (req, res) => {
        const users = db.users.filter((user) => user.id === req.params.id);
        if (users.length === 1) {
            const user = users[0];
            user.firstName = req.body.firstName || user.firstName;
            user.lastName = req.body.lastName || user.lastName;
            user.username = req.body.username || user.username;
            user.password = req.body.password || user.password;
            user.gender = req.body.gender || user.gender;
            user.birthDate = req.body.birthDate ? new Date(req.body.birthDate) : user.birthDate;
            saveDb();
            res.status(200).json({ user });
        }
        else {
            res.status(404).json({ error: 'User not found.' });
        }
    });
    app.delete('/user/:id', (req, res) => {
        const users = db.users.filter((user) => user.id === req.params.id);
        if (users.length === 1) {
            db.users = db.users.filter((user) => user !== users[0]);
            saveDb();
            res.status(200).json({ user: users[0] });
        }
        else {
            res.status(404).json({ error: 'User not found.' });
        }
    });
    app.get('/user/:id', (req, res) => {
        const users = db.users.filter((user) => user.id === req.params.id);
        if (users.length === 1) {
            res.status(200).json({ user: users[0] });
        }
        else {
            res.status(404).json({ error: 'User not found.' });
        }
    });
    app.listen(SERVER_PORT, () => {
        console.log(`Server listening on port ${SERVER_PORT}.`);
    });
})();
