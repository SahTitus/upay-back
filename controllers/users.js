import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../model/user.js";

const secret = "test";

export const getUsers = async (req, res) => {
  const users = await User.find();
  if (!users) {
    return res.status(204).json({ message: "No user found" });
  }
  res.json(users);
};
export const getUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required." });
  }
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ message: `User ID ${id} not found` });
  const user = await User.findOne({ _id: id }).exec();

  if (!user) {
    return res.status(400).json({ message: `User ID ${id} not found` });
  }

  res.json(user);
};

export const getAdmin = async (req, res) => {
  const { id } = req.params;

  const password = id;

  const admin = await User.findOne({ email: "admin@gmail.com" });

  if (!admin) return res.status(404).json({ message: "User not found" });

  const isPasswordCorrect = await bcrypt.compare(password, admin.password);

  if (!isPasswordCorrect)
    return res.status(404).json({ message: "Invalid credentials" });

  const token = jwt.sign({ email: admin.email, id: admin._id }, secret, {
    expiresIn: "1000h",
  });

  res.status(200).json({ result: admin, token });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(404).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      secret,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const signup = async (req, res) => {
  const { email, name, level, program, password, confirmPassword, image, indexNo } =
    req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password don't match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name,
      level,
      program,
      image,
      indexNo,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1h",
    });

    res.status(200).json({ result, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const updateUser = async (req, res) => {
  const { id: _id } = req.params;
  const user = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).send({ message: `User ID ${id} not found` });

  const token = jwt.sign({ email: user.email, id: user._id }, secret, {
    expiresIn: "1h",
  });

  const result = await User.findByIdAndUpdate(_id, user, { new: true });

  res.json({ result, token });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log("Eko o");

  const user = await User.findOne({ _id: id }).exec();
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ message: `user ID ${id} not found` });

  await user?.deleteOne({ _id: id });
  res.json({ message: "user deleted successfully" });
};

export const makePayment = async (req, res) => {
  const { id } = req.params;

  const transData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ message: `User ID ${id} not found` });

  const user = await User.findOne({ _id: id }).exec();

  user.transData.push({ ...transData, createdAt: new Date().toISOString() });

  const token = jwt.sign({ email: transData.email, id: id }, secret, {
    expiresIn: "1h",
  });

  const result = await User.findByIdAndUpdate(id, user, { new: true });

  res.json({ result, token });
};

export const addFees = async (req, res) => {
  const { id } = req.params;

  const feesData = req.body;

  const admin = await User.findOne({ email: "admin@gmail.com" });

  if (!admin) return res.status(404).json({ message: "Admin not found" });

  admin.fees.push({
    ...feesData,
    id: Math.floor(Math.random() * 100) * 1803126400,
    createdAt: new Date().toISOString(),
  });

  const updatedAdmin = await User.findByIdAndUpdate(id, admin, { new: true });

  res.json(updatedAdmin);
};
