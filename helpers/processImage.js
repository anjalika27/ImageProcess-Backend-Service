import axios from "axios";
import sharp from "sharp";
import pool from "../model/db.js";
import { v4 as uuid } from "uuid";

export async function processImage(jobId, visits) {
    for (const visit of visits) {
        const { image_url, store_id, visit_time } = visit;
        // console.log(visit);
        for (const url of image_url) {
            console.log(url);

            try {
                const response = await axios({ url: url, responseType: 'arraybuffer' });
                const metadata = await sharp(response.data).metadata();
                const perimeter = 2 * (metadata.height + metadata.width);
                console.log(perimeter);


                const randomNumber = Math.floor(Math.random() * (4000 - 1000 + 1)) + 1000;

                console.log(randomNumber);
                setTimeout(() => {
                    //sleep
                }, randomNumber);
                console.log("jooooo");

                const imageId = uuid()
                const data = await pool.query(
                    "insert into images (id, job_id, store_id, perimeter, created_at, url ) values ($1, $2, $3, $4,$5,$6)",
                    [imageId, jobId, store_id, perimeter, new Date().toISOString(), url]
                );
                console.log("done", jobId);
                // return res.status(201).json({ msge: 'Image processed', jobId, store_id, image_url })
            } catch (error) {
                // return res.status(500).json({ msge: 'Image processing failed', jobId, store_id, image_url })
                console.log({ msge: 'Image processing failed', jobId, store_id, image_url });

            }
        }
    }
    await pool.query("UPDATE jobs SET status = $1 WHERE id = $2", ["Completed", jobId]);
    // return res.status(201).json({
    //     msge: 'job sucessfully completed',
    //     jobId, store_id
    // })
}
