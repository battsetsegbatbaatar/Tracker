const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const refreshToken =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  console.log(req.headers.authorization, "kk");
  console.log(refreshToken, "refreshToken");
  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(refreshToken, secretKey);
    req.user = decoded;
    console.log(decoded, "decoded");
    next();
    res.status(200), json({ message: "Success" });
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = { verifyToken };
