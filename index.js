import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import UsersRouter from './Routers/UserRouter.js';
import LinksRouter from './Routers/LinkRouter.js';
import connectDB from './DB/database.js';

const app = express();
const port = 8787;

app.use(cors());
app.use(bodyParser.json()); // Parses application/json

app.use('/users', UsersRouter);
app.use('/links', LinksRouter);
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

connectDB();
