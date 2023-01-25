"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.createNewUser = void 0;
const db_1 = __importDefault(require("../db"));
const auth_1 = require("../modules/auth");
const createNewUser = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Invalid body provided.' });
    }
    (0, auth_1.hashPassword)(password)
        .then((hash) => db_1.default.user.create({
        data: {
            username,
            password: hash
        }
    }))
        .then((user) => (0, auth_1.createJWT)(user))
        .then((token) => res.status(201).json({ token }));
};
exports.createNewUser = createNewUser;
const getToken = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Invalid body provided.' });
    }
    db_1.default.user.findUnique({ where: { username } })
        .then((user) => {
        if (!user ||
            !(0, auth_1.comparePassword)(password, user.password)) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        const token = (0, auth_1.createJWT)(user);
        res.status(200).json({ token });
    });
};
exports.getToken = getToken;
