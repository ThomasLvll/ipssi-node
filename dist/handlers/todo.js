"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToDoList = exports.deleteToDoList = exports.updateToDoList = exports.createNewToDoList = exports.getCurrentUserToDoLists = void 0;
const db_1 = __importDefault(require("../db"));
const getCurrentUserToDoLists = (req, res) => {
    db_1.default.toDoList.findMany({
        where: {
            userId: req.user?.id
        }
    })
        .then((toDoLists) => res.status(200).json({ toDoLists: toDoLists }))
        .catch((error) => res.status(500).json());
};
exports.getCurrentUserToDoLists = getCurrentUserToDoLists;
const createNewToDoList = (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Invalid body provided.' });
    }
    db_1.default.toDoList
        .create({
        data: {
            name,
            userId: req.user?.id
        }
    })
        .then((toDoList) => res.status(201).json({ toDoList }))
        .catch((error) => res.status(500).json());
};
exports.createNewToDoList = createNewToDoList;
const updateToDoList = (req, res) => {
    db_1.default.toDoList
        .update({
        where: {
            id: req.params.id,
            userId: req.user?.id
        },
        data: {
            name: req.body?.name
        }
    })
        .then((toDoList) => {
        if (!toDoList) {
            return res.status(404).json({ error: 'To-do list not found.' });
        }
        res.status(200).json({ toDoList });
    })
        .catch((error) => res.status(500).json());
};
exports.updateToDoList = updateToDoList;
const deleteToDoList = (req, res) => {
    db_1.default.toDoList
        .delete({ where: {
            id: req.params.id,
            userId: req.user?.id
        } })
        .then((toDoList) => {
        if (!toDoList) {
            return res.status(404).json({ error: 'To-do list not found.' });
        }
        res.status(200).json({ toDoList });
    })
        .catch((error) => res.status(500).json());
};
exports.deleteToDoList = deleteToDoList;
const getToDoList = (req, res) => {
    db_1.default.toDoList
        .findUnique({ where: {
            id: req.params.id,
            userId: req.user?.id
        } })
        .then((toDoList) => {
        if (!toDoList) {
            return res.status(404).json({ error: 'To-do list not found.' });
        }
        res.status(200).json({ toDoList });
    })
        .catch((error) => res.status(500).json());
};
exports.getToDoList = getToDoList;
