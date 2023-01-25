import * as express from 'express';


const app = express.Router();

app.get('/me', (req, res) => {
    res.status(200).json({ user: req.user });
});

export default app;
