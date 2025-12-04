const jwt = require("jsonwebtoken");

const verifyAcademicToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Allowed academic roles
    const allowed = ["academic", "dean", "vice-dean", "president"];

    if (!allowed.includes(decoded.role)) {
      return res.status(403).json({ message: "Access forbidden for this role." });
    }

    req.user = decoded; // push token data into request
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = { verifyAcademicToken };
