import express from "express";
import { getBook } from "../controller/book.controller.js";

const bookRoute = express.Router();

bookRoute.get("/", getBook);

export default bookRoute;