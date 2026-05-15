import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constant/cookieName.js";

export const createToken = (id, email, expiresIn) => {
  const payload = { id, email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
  return token;
};
