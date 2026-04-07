const jwt = require("jsonwebtoken");

// ✅ VERIFY TOKEN (for logged-in users)
exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // format: "Bearer TOKEN"
    const actualToken = token.split(" ")[1];

    const decoded = jwt.verify(actualToken, "secretkey");

    req.user = decoded; // contains userId + role

    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ ADMIN ONLY
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied (Admin only)" });
  }

  next();
};