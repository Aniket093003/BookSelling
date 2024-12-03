import { Router } from "express";


import Book from "../model/book.model.js";
const bookRoute = Router()


bookRoute.get ("/get"  ,  async(req, res) => {
    try {
        const book = await Book.find();
        res.status(200).json(book);
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json(error);
    }
});

export default bookRoute;