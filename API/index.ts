import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import cookieParser from "cookie-parser";
import usersRouter from "./routes/users";
import institutionsRouter from "./routes/institutions";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/users", usersRouter);
app.use("/institutions", institutionsRouter);

const run = async () => {
    await mongoose.connect(config.db);
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
    process.on("exit", () => {
        mongoose.disconnect();
    })
};

run().catch((err) => {console.log(err)});