import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/index.js"
import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";
connectDB()
const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

app.use("/book", bookRoute);
app.use("/user", userRoute);

app.listen(process.env.PORT)