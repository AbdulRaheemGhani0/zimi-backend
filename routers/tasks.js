const express = require("express");
const router = express.Router();
const Task = require("../models/Task.js");
const sendResponse = require("./helpers/sendResponce.js"); 


router.post("/", async (req, res) => {
    try {
        console.log("🛠️ Request Body:", req.body); // 🔴 Check if `req.body` is received

        if (!req.body || !req.body.task) {
            return sendResponse(res, null, 400, true, "Task is required");
        }

        const { task } = req.body;
        let newTask = new Task({ task });
        newTask = await newTask.save();
        sendResponse(res, newTask, 201, false, "Task added successfully");
    } catch (error) {
        console.error("❌ Task Creation Error:", error);
        sendResponse(res, null, 500, true, "Error adding task");
    }
});



router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        sendResponse(res, tasks, 200, false, "Tasks fetched successfully");
    } catch (error) {
        sendResponse(res, null, 500, true, "Error fetching tasks");
    }
});


router.put("/:id", async (req, res) => {
    try {
        const { task, completed } = req.body;  // ✅ Get new task data

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            { task, completed }, // ✅ Update task and completion status
            { new: true } // ✅ Return updated document
        );

        if (!updatedTask) {
            return sendResponse(res, null, 404, true, "Task not found");
        }

        sendResponse(res, updatedTask, 200, false, "Task updated successfully");
    } catch (error) {
        sendResponse(res, null, 500, true, "Error updating task");
    }
});



router.delete("/:id", async (req, res) => {
    try {
        console.log("Deleting Task with ID:", req.params.id);
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return sendResponse(res, null, 404, true, "Task not found");
        }
        sendResponse(res, deletedTask, 200, false, "Task deleted successfully");
    } catch (error) {
        console.error("Delete Error:", error);
        sendResponse(res, null, 500, true, "Error deleting task");
    }
});


module.exports = router; 



