import Bull from "bull";
import { processImage } from "../helpers/processImage.js";

const jobQueue=new Bull('jobQueue',{
    redis: { host: "127.0.0.1", port: 6379 },
})

export const addJob=async (jobId,visits)=>{
    const job=await jobQueue.add({jobId,visits});
    return;
}

jobQueue.process(async({jobId,visits})=>{
    try {
        await processImage(jobId,visits);
    } catch (error) {
        console.error(`Job ${jobId} failed:`, error);
    }
})


