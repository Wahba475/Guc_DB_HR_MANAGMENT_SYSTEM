const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyHRToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(403).json({
      success: false,
      message: "Access denied. No token provided.",
    });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "HR") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Not an HR employee.",
      });
    }

    req.user = decoded; // attach token data
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
      error: error.message,
    });
  }
};

module.exports = { verifyHRToken };
