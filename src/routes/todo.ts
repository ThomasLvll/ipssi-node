import * as express from 'express';
import * as toDoHandler from '../handlers/todo';
import db from '../db';


const app = express.Router();

app.get('/todos', toDoHandler.getCurrentUserToDoLists);
app.post('/todo', toDoHandler.createNewToDoList);
app.put('/todo/:id', toDoHandler.updateToDoList);
app.delete('/todo/:id', toDoHandler.deleteToDoList);
app.get('/todo/:id', toDoHandler.getToDoList);



export default app;
