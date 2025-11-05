// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Schema & Model
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

// ✅ Routes
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ _id: 1 });
    res.json(todos);
  } catch (err) {
    console.error("GET /api/todos error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/todos", async (req, res) => {
  try {
    const newTodo = new Todo({ task: req.body.task });
    const saved = await newTodo.save();
    res.json(saved);
  } catch (err) {
    console.error("POST /api/todos error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Todo not found" });
    res.json(updated);
  } catch (err) {
    console.error("PUT /api/todos/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Todo not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE /api/todos/:id error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Connect to MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected to Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

