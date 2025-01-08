import Bull from "bull";
import { processImage } from "../helpers/processImage";

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

// Optional: Handle job completion
jobQueue.on('completed', (job) => {
    console.log(`Job ${job.id} completed!`);
});

jobQueue.on('failed', (job, err) => {
    console.log(`Job ${job.id} failed: ${err.message}`);
});

