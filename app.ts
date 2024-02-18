require('dotenv').config();

import express from 'express';
import * as mongoose from "mongoose";
import userRouter from "./routes/user.router";

const app = express();
const PORT = process.env.PORT;
const DB_CONNECTION_URL = process.env.DB_CONNECTION_URL;

app.use(express.json());
app.use('/api', userRouter);

_mongooseConnector();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

function _mongooseConnector() {
    mongoose.connect(DB_CONNECTION_URL as string);
}
