import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
  let token

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]
  }//check header first

  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token
  }//otherwise check cookies

  if (!token) {
    return res.status(401).json({ message: "Unauthorized:No token" })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Forbidden: Invalid token" });
  }
};
