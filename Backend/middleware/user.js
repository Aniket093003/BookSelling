import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({
      message: "Access denide, No vaild token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
    req.userID = decoded.userID;
    next();
  } catch (error) {
    return res.status(400).json({
      message: "unauthorised token",
    });
  }
};

export default userAuth;
