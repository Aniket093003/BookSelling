import jwt from "jsonwebtoken";
import adminModel from "../model/admin.model.js";
import bcrypt from "bcrypt";
import { Router } from "express";
import dotenv from "dotenv";
import adminAuth from "../middleware/admin.js";
dotenv.config();
const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  if ( !fullName || !email || !password ) {
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
    const user = await adminModel.create({ fullName, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, process.env.JWT_ADMIN_SECRET, {
      expiresIn: "1h", 
    });

    res.status(201).json({
      message: "Congratulations, You are signed up",
      user: { id: user._id, fullName: user.fullName, email: user.email }, 
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

    const token = jwt.sign({ id: admin._id });

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

adminRouter.post("/Add", adminAuth, async(req, res) => {
  return res.json({
    msg: "working"
  })
})




export default adminRouter;
