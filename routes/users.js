import express from "express";
import {
  signin,
  signup,
  getUsers,
  deleteUser,
  updateUser,
  makePayment,
  getUser,
  getAdmin,
  addFees,
} from "../controllers/users.js";

const router = express.Router();

router.route("/users").get(getUsers);
router.route("/signup").post(signup);
router.route("/signin").post(signin);

router.route("/:id/delete").delete(deleteUser);
router.route("/:id").patch(updateUser);
router.route("/:id/pay").patch(makePayment);
router.route("/:id/addFees").patch(addFees);

router.route("/:id").get(getUser);
router.route("/:id/admin").get(getAdmin);

export default router;
