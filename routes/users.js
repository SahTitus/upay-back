import express from "express";
import {
  signin,
  signup,
  getUsers,
  deleteUser,
  updateUser,
  makePayment,
} from "../controllers/users.js";

const router = express.Router();

router.route("/users").get(getUsers);
router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/:id/delete").delete(deleteUser);
router.route("/:id").patch(updateUser);
router.route("/:id/pay").patch(makePayment);

export default router;
