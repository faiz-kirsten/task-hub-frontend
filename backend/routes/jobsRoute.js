import express from "express";
import {
    addJob,
    getJobs,
    getJob,
    updateJob,
} from "../controllers/jobsController.js";

const router = express.Router();

// get job listings
router.get("/", getJobs);

// get job listing
router.get("/:id", getJob);

// create a new job listing
router.post("/", addJob);

// update a job listing
router.put("/:id", updateJob);

export default router;
