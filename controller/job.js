import pool from "../model/db.js"
import { addJob } from "../services/jobProcessor.js";

import { v4 as uuid } from 'uuid';

export async function submitJob(req, res) {
    // // console.log('req processing');
    // // await addJob('1',['a','b']);
    // const response = await axios({ url: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Chain_link_icon_slanted.png', responseType: 'arraybuffer' });
    // const buffer = Buffer.from(response.data);

    // // Using sharp to get metadata
    // const metadata = await sharp(buffer).metadata();
    // return res.send(metadata);

    const { count, visits } = req.body;
    if (!count || !visits || count !== visits.length) {
        return res.status(400).json({
            error: 'Invalid/Empty input fields'
        })
    }

    try {
        const jobId = uuid();
        const data = await pool.query('insert into jobs values($1,$2,$3)', [jobId, 'Ongoing', new Date().toISOString()]);
        await addJob(jobId, visits);
        return res.status(201).json({
            jobId
        })
    } catch (error) {
        return res.status(500).json({
            error: 'Internal server error'
        })
    }
}

export async function getJobStatus(req, res) {
    const { jobId } = req.query;
    if (!jobId) return res.status(400).json({ error: 'pass jobId as a query parameter' });
    try {
        const jobData = await pool.query('select * from jobs where "id"=($1)', [String(jobId)]);
        if (jobData.rows.length === 0) return res.status(400).json({ error: `Can't find job with ID ${jobId}` })
        else {
            const data = jobData.rows[0];
            if (data.status === 'Completed') return res.status(200).json({
                status: 'Completed',
                jobId
            })
            else if (data.status === 'Failed') {
                //something needs to be cooked
            }
            return res.status(200).json({
                status: 'Ongoing',
                jobId
            })
        }
    } catch (error) {
        return res.status(404).json({
            error: 'Bad Request'
        })
    }
}

