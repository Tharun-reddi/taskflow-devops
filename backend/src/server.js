import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" }
}, { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "taskflow-backend" });
});

app.get("/api/tasks", async (req, res) => {
  try {
    res.json(await Task.find().sort({ createdAt: -1 }));
  } catch {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Title is required" });

    const task = await Task.create({
      title: title.trim(),
      description: description || "",
      priority: priority || "medium"
    });
    res.status(201).json(task);
  } catch {
    res.status(500).json({ message: "Failed to create task" });
  }
});

app.patch("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch {
    res.status(400).json({ message: "Invalid task update" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch {
    res.status(400).json({ message: "Invalid task id" });
  }
});

export async function startServer() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
  return app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

if (process.env.NODE_ENV !== "test") {
  startServer().catch(error => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  });
}

export default app;
