const jwt = require("jsonwebtoken");
const config = require("config");

function adminAuth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");
  try {
    const decoded = jwt.verify(token, config.get("authKey"));
    if (!decoded.isAdmin)
      return res.status(400).send("Access Denied. Not an Admin");
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}

module.exports = adminAuth;
