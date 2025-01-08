import axios from "axios";
import sharp from "sharp";
import pool from "../model/db.js";
import { v4 as uuid } from "uuid";

export async function processImage(jobId, visits) {
    const errors = [];

    for (const visit of visits) {
        const { image_url, store_id, visit_time } = visit;
        const storeExists = await pool.query("SELECT * FROM retailstore WHERE 'storeId' = ($1)", [String(store_id)]);

        if (storeExists.rowCount === 0) {
            errors.push({ store_id, error: 'Store ID does not exist' });
            console.log(store_id);

            console.log('storeid not present');

            continue;
        }

        for (const url of image_url) {
            try {

                const response = await axios({ url: url, responseType: 'arraybuffer' });
                const metadata = await sharp(response.data).metadata();
                const perimeter = 2 * (metadata.height + metadata.width);
                const sleepTime = Math.floor(Math.random() * 300) + 100;

                setTimeout(() => {
                    //sleep
                }, sleepTime);

                const imageId = uuid()
                const data = await pool.query(
                    "insert into images (id, job_id, store_id, perimeter, created_at, url) values ($1, $2, $3, $4,$5,$6)",
                    [imageId, jobId, store_id, perimeter, new Date().toISOString(), url]
                );

                // return res.status(201).json({ msge: 'Image processed', jobId, store_id, image_url })
            } catch (error) {
                // return res.status(500).json({ msge: 'Image processing failed', jobId, store_id, image_url })
                console.log({ msge: 'Image processing failed', jobId, store_id, image_url });
                errors.push({ store_id, error: `Image download failed for URL: ${url}` });

            }
        }
    }
    if (errors.length > 0) {
        await pool.query("UPDATE jobs SET status = $1 WHERE 'id' = $2", ['Failed', jobId]);
        return { status: 'failed', job_id: jobId, error: errors };
    } else {
        await pool.query("UPDATE jobs SET status = $1 WHERE 'id' = $2", ['Completed', jobId]);
        return { status: 'completed', job_id: jobId };
    }
    // return res.status(201).json({
    //     msge: 'job sucessfully completed',
    //     jobId, store_id
    // })
}
