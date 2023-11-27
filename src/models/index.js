import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please provide Name of the user"] },
  email: { type: String, required: [true, "Please provide email of the user"] },
  password: {
    type: String,
    required: [true, "Please provide password of the user"],
  },
  todoRef: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }],
});

const todosSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Please provide title of the todo"] },
  description: {
    type: String,
    required: [true, "Please provide description of the todo"],
  },
  completed: { type: Boolean, required: true, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Todo = mongoose.models.Todo || mongoose.model("Todo", todosSchema);
