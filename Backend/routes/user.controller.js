import { Router } from "express";
import userModel from "../model/user.model.js";
const userRouter = Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

userRouter.post("/signup", async (req, res)=>{
    const { fullName, email, password } = req.body;

  if (!email || !password || !fullName) {
    return res.status(411).json({
      Error: true,
      message: "All feilds {email, password, firstName, lastName} required",
    });
  }
  try {
    const existingUser = await userModel.findOne({
      email,
    });
    if (existingUser) {
      return res.json({
        message: "you are already signed up",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_USER_SECRET);
    console.log(token);

    res.json({
      message: "Congratulation, You are signed up as user",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: true, message: "Internal server error" });
  }
});

userRouter.post("/signin", async (req, res)=>{
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        Error: true,
        message: "Email and password are required",
      });
    }
  
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).json({
          Error: true,
          message: "Invalid email or password",
        });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          Error: true,
          message: "Invalid email or password",
        });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_USER_SECRET);
  
      res.json({
        message: user.password,
  
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ Error: true, message: "Internal server error" });
    }
});

userRouter.get("/user/purchases", (req, res)=>{

});

userRouter.post("/user/purchase", (req, res)=>{

});

export default  userRouter ;