import jwt from "jsonwebtoken";
import { COOKIE_NAME, JWT_SECRET } from "../constant/cookieName.js";

export const verifyToken = async (req, res, next) => {
  const token = await req.signedCookies[`${COOKIE_NAME}`];

  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token not recived" });
  }

  return new Promise((resolve, reject) => {
    return jwt.verify(token, JWT_SECRET, (err, success) => {
      if (err) {
        reject(err.message);
        return res.status(401).json({ message: "Token expire" });
      } else {
        resolve();
        res.locals.jwtData = success;
        return next();
      }
    });
  });
};
