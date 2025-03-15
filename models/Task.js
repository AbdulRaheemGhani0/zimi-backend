const mongoose = require("mongoose");

const { Schema } = mongoose;

const taskSchema = new Schema(
    {
        task: { type: String, required: true }, // 🔥 Ensure `task` is required
        completed: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema); // ✅ Correct Export
