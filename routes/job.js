import express from "express";
import { submitJob, getJobStatus } from "../controller/job.js";
const router = express.Router();

router.post("/submit", submitJob);
router.get("/status", getJobStatus);

export default router;
