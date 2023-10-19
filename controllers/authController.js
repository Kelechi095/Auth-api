import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    //VERIFY USER INPUT
    if (!username || !email || !password) {
      return next(errorHandler(400, "Fill all fields"));
    }

    //HASH PASSWORD
    const hashedPassword = bcrypt.hashSync(password, 10);

    //CREATE AND SAVE NEW USER
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ msg: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  //VERIFY USER INPUT
  const { email, password } = req.body;

  try {
    if (!email || !password) return next(errorHandler(404, "Fill all fields"));

    //VERIFY THAT USER EXISTS
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    //VERIFY PASSWORD
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

    generateToken(res, validUser._id);

    res.status(200).json({ msg: "Login successful" });
  } catch (error) {
    next(error);
  }
};

export const loginWithGoogle = async (req, res, next) => {
  const {email, name, photo} = req.body

  if(!email ||!name || !photo) return res.status(400).json({msg: "Please fill all fields"})
  try {
    const user = await User.findOne({ email });
    
    if (user) {
      generateToken(res, user._id);
      res.status(200).json(user);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 1000).toString(),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });
      await newUser.save();
      generateToken(res, newUser._id);
      res.status(200).json(newUser);
    }
  } catch (error) {
    next(error);
  }
};
export const setUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ msg: "User logged out" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

const products = [
  {
    id: 1,
    title: "Rice",
  },
  {
    id: 2,
    title: "Beans",
  },
  {
    id: 3,
    title: "Eggs",
  },
];

export const getProducts = async (req, res) => {
  try {
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
