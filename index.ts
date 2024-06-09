import express, { Express, Request, Response } from "express";
// import dotenv from "dotenv";
const dotenv = require('./node_modules/dotenv');
import cors from "cors";
import connectToDB from "./db";
import MainRoutes from "./routes/main.routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

connectToDB().then().catch();
app.use(cors());

app.use(express.json());

app.use(MainRoutes.routes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});