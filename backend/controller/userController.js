import User from "../models/User.js";
import { hash } from "bcrypt";
import { COOKIE_NAME } from "../constant/cookieName.js";
import { createToken } from "../utils/tokenManager.js";

export const userSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isUserExist = await User.findOne({ email });
    if (isUserExist)
      return res
        .status(401)
        .json({ massage: "User is already exist!", success: false });
    const hashPassword = await hash(password, 10);
    const user = await User.create({ email, name, password: hashPassword });
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domaine: "localhost",
      signed: true,
      path: "/",
    });

    const token = createToken(user._id.toString(), user.email, "7d");
    const expireDate = new Date();
    res.cookie(COOKIE_NAME, {
      path: "/",
      domaine: "localhost",
      expireDate,
      httpOnly: true,
      signed: true,
    });

    return res.status(201).json({ message: "OK", user, token });
  } catch (error) {
    return res.status(500).json({
      message: "Something Wrong !",
      success: false,
      error: error.message,
    });
  }
};
