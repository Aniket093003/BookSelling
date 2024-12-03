import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import adminModel from "../model/admin.model.js";
import bcrypt from "bcrypt";
import { Router } from "express";
import dotenv from "dotenv";
import adminAuth from "../middleware/admin.js";
import bookModel from "../model/book.model.js";
dotenv.config();
const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      error: true,
      message: "All fields {fullName, email, password} are required",
    });
  }

  try {
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        error: true,
        message: "You are already signed up as admin",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await adminModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_ADMIN_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Congratulations, You are signed up",
      admin: { id: user._id, fullName: user.fullName, email: user.email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});
adminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Email and password are required",
    });
  }

  try {
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        error: true,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: true,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_ADMIN_SECRET);

    res.json({
      message: "Successfully signed in",
      user: { id: admin._id, fullName: admin.fullName, email: admin.email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});
adminRouter.post("/book", adminAuth, async (req, res) => {
  const adminID = req.adminID;
  const { title, category, image, price } = req.body;

  // Validate input
  if (!title || !price || !category || !image) {
    return res.status(400).json({
      msg: "Please provide all details {title, price, category, image}",
    });
  }

  try {
    // Check for an existing book with the same title
    const existingBook = await bookModel.findOne({ title });
    if (existingBook) {
      return res.status(409).json({
        error: true,
        message: "Book already exists",
      });
    }

    // Create a new book
    const newBook = await bookModel.create({
      title,
      price,
      category,
      image,
      creatorID: adminID, // If creatorID is optional, remove it from schema
    });

    res.status(201).json({
      message: "Book added",
      bookID: newBook._id,
    });
  } catch (err) {
    res.status(500).json({
      err: true,
      message: "Internal server error",
      details: err.message,
    });
  }
});
adminRouter.put("/book/:id", adminAuth, async (req, res) => {
  const adminID = req.adminID; 
  const { id } = req.params; 
  const { title, category, image, price } = req.body; 
  if (!title || !price || !category || !image) {
    return res.status(400).json({
      msg: "Please provide at least one field to update {title, price, category, image}",
    });
  }

  try {
    const existingBook = await bookModel.findById(id);
    if (!existingBook) {
      return res.status(404).json({
        error: true,
        message: "Book not found",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        msg: "Invalid book ID format",
      });
    }

    const updatedBook = await bookModel.findByIdAndUpdate(
      id,
      {
        title,
      price,
      category,
      image,
      creatorID: adminID,
      },
      { new: true } 
    );

    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (err) {
    res.status(500).json({
      err: true,
      message: "Internal server error",
      details: err.message,
    });
  }
});



export default adminRouter;
