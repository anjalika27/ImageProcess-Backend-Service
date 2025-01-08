import axios from "axios";
import sharp from "sharp";
import pool from "../model/db";
import { v4 as uuid } from "uuid";

export async function processImage(jobId, visits) {
    for (const visit of visits) {
        const { image_url, store_id, visit_time } = visit;
        try {
            const response = await axios({ url: image_url, responseType: 'arraybuffer' });
            const metadata = await sharp(response.data).metadata();
            const perimeter = 2 * (metadata.height + metadata.width);

            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve
                }, Math.random() * 400);
            })

            const imageId = uuid()
            await pool.query(
                "insert into images (id, job_id, store_id, perimeter, created_at, image_url ) values ($1, $2, $3, $4)",
                [imageId, jobId, store_id, perimeter, new Date().toISOString(), image_url]
            );

            return res.status(201).json({ msge: 'Image processed', jobId, store_id, image_url })
        } catch (error) {
            return res.status(500).json({ msge: 'Image processing failed', jobId, store_id, image_url })
        }
    }
    await pool.query("UPDATE jobs SET status = $1 WHERE id = $2", ["Completed", jobId]);
    return res.status(201).json({
        msge: 'job sucessfully completed',
        jobId, store_id
    })
}
