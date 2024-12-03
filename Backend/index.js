import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/index.js"
import bookRoute from "./routes/book.controller.js";
import userRouter from "./routes/user.controller.js";
import adminRouter from "./routes/admin.controller.js";
connectDB()
const app = express();

app.use(cors({
    orign:"*"
}));
app.use(express.json());

dotenv.config();



app.use("/book", bookRoute);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.listen(process.env.PORT)