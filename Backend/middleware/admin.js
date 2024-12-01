import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const adminAuth = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({
      message: "Acces denied! , No valid token Provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    req.adminID = decoded.adminID;
    next();
  } catch (error) {
    return res.status(400).json({
      message: "unauthorised token",
    });
  }
};

export default adminAuth;
