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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.comparePassword = exports.protect = exports.createJWT = void 0;
const db_1 = __importDefault(require("../db"));
const jwt = __importStar(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const createJWT = (user) => {
    const token = jwt.sign({ sub: user.id }, process.env.TOKEN_SECRET);
    return token;
};
exports.createJWT = createJWT;
const protect = (req, res, next) => {
    const [, token] = (req.headers.authorization || '').split('Bearer ');
    if (!token) {
        return res.status(401).send();
    }
    jwt.verify(token, process.env.TOKEN_SECRET, async (error, decoded) => {
        if (error) {
            return res.status(401).json({ error: 'Invalid token.' });
        }
        req['user'] = await db_1.default.user.findUnique({ where: { id: decoded?.sub } }) || undefined;
        console.log(`Authenticated user: ${req.user?.username} (id: ${req.user?.id})`);
        return next();
    });
};
exports.protect = protect;
const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash);
};
exports.comparePassword = comparePassword;
const hashPassword = (password) => {
    return bcrypt.hash(password, 10);
};
exports.hashPassword = hashPassword;
