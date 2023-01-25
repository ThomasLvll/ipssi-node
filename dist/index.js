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
const dayjs_1 = __importDefault(require("dayjs"));
const express_1 = __importDefault(require("express"));
const userHandler = __importStar(require("./handlers/user"));
const auth_1 = require("./modules/auth");
(async () => {
    (await Promise.resolve().then(() => __importStar(require('dotenv')))).config();
    const { SERVER_PORT, DB_URL, } = process.env;
    const app = (0, express_1.default)()
        .use(express_1.default.urlencoded({ extended: true }), express_1.default.json(), express_1.default.static('public'), (req, res, next) => {
        console.log(`[${(0, dayjs_1.default)().format('YYYY-MM-DD HH:mm:ss.SSS Z')}] ${req.method} - ${req.url} - ${req.ip}`);
        next();
    });
    app.get('/ping', (req, res) => {
        res.status(200).send('pong');
    });
    app.use('/api', auth_1.protect, [
        (await Promise.resolve().then(() => __importStar(require('./routes/user')))).default,
        (await Promise.resolve().then(() => __importStar(require('./routes/todo')))).default
    ]);
    app.use('/signup', userHandler.createNewUser);
    app.use('/login', userHandler.getToken);
    app.listen(SERVER_PORT, () => {
        console.log(`Server listening on port ${SERVER_PORT}.`);
    });
})();
