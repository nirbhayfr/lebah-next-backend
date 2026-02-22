import mongoose from "mongoose";

const superCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.models.SuperCategory ||
  mongoose.model("SuperCategory", superCategorySchema);
