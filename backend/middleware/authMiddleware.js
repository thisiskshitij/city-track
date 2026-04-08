const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const actualToken = token.split(" ")[1];

    const decoded = jwt.verify(actualToken, "secretkey");

    req.user = decoded; // contains userId + role

    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

//Admin only
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied (Admin only)" });
  }

  next();
};