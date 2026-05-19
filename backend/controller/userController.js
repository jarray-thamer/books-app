import User from "../models/User.js";
import { hash, compare } from "bcrypt";
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

// user login function

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        massage: "User not found, try to sign-up first !",
        success: false,
      });
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(403)
        .json({ massage: "wrong Password !", success: false });
    }
    // clear cookie
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

    return res
      .status(200)
      .json({ massage: "Login success", success: true, user, token });
  } catch (error) {
    return res.status(500).json({
      message: "Something Wrong !",
      success: false,
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    console.log(res.locals.jwtData);
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).json({
        message: "User not registered OR token malfunctioned",
        success: false,
      });
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res
        .status(401)
        .json({ massage: "Permission Didn't match", success: false });
    }
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domaine: "localhost",
      signed: true,
      path: "/",
    });
    return res
      .status(200)
      .json({ massage: "user logout success", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Something Wrong !",
      success: false,
      error: error.message,
    });
  }
};
