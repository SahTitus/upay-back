import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
  fees: {
    type: [Object],
    amount: { type: "String", required: true },
    program: { type: "String", required: true },
    level: { type: "String", required: true },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
});

export default mongoose.model("Admin", adminSchema);