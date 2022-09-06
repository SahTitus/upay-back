import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: { type: "String", required: true },
  name: { type: "String", required: true },
  program: { type: "String", required: true },
  level: { type: "String", required: true },
  password: { type: "String", required: true },
  transData: {
    type: [Object],
    level: String,
    amount: String,
    paymentType:  String,
    status: String,
  },
  id: { type: "String" },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("User", userSchema);
