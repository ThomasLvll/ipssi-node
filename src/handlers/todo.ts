import {
    Request,
    RequestHandler
} from 'express';
import db from '../db';


interface TypedRequestParam extends Request {
    body: {
        name: string;
    }
}

export const getCurrentUserToDoLists: RequestHandler = (req, res) => {
    db.toDoList.findMany({
        where: {
            userId: req.user?.id
        }
    })
        .then((toDoLists) => res.status(200).json({ toDoLists: toDoLists }))
        .catch((error) => res.status(500).json());
};

export const createNewToDoList: RequestHandler = (req: TypedRequestParam, res) => {
    const { name } = req.body;
    if (! name) {
        return res.status(400).json({ error: 'Invalid body provided.' });
    }
    db.toDoList
        .create({
            data: {
                name,
                userId: <string>req.user?.id
            }
        })
        .then((toDoList) => res.status(201).json({ toDoList }))
        .catch((error) => res.status(500).json());
};

export const updateToDoList: RequestHandler = (req: TypedRequestParam, res) => {
    db.toDoList
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
            if (! toDoList) {
                return res.status(404).json({ error: 'To-do list not found.' });
            }
            res.status(200).json({ toDoList });
        })
        .catch((error) => res.status(500).json());
};

export const deleteToDoList: RequestHandler = (req, res) => {
    db.toDoList
        .delete({ where: {
            id: req.params.id,
            userId: req.user?.id
        }})
        .then((toDoList) => {
            if (! toDoList) {
                return res.status(404).json({ error: 'To-do list not found.' });
            }
            res.status(200).json({ toDoList });
        })
        .catch((error) => res.status(500).json());
};

export const getToDoList: RequestHandler = (req, res) => {
    db.toDoList
        .findUnique({ where: {
            id: req.params.id,
            userId: req.user?.id
        }})
        .then((toDoList) => {
            if (! toDoList) {
                return res.status(404).json({ error: 'To-do list not found.' });
            }
            res.status(200).json({ toDoList });
        })
        .catch((error) => res.status(500).json());
};
