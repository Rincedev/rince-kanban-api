import 'dotenv/config';
import express from 'express';
import { router } from "./src/router.js";
import { notFound, errorHandler } from "./src/middlewares/errorHandlers.js";
import { xss } from 'express-xss-sanitizer';
import cors from 'cors';

const app = express();
app.set("trust proxy", 1);

app.use(express.json());

app.use(cors({
    origin: (origin, callback) => {
    if (!origin || /^(http:\/\/localhost:\d+|http:\/\/127\.0\.0\.1:\d+)$/.test(origin)) {
    callback(null, true);
    } else {
    callback(new Error("Not allowed by CORS"));
    }
    },
    }));

app.use(xss());

app.use(router);

app.use(notFound);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.BASE_URL}:${process.env.PORT}`);
});