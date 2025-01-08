import express from "express"
import jobRoutes from './routes/job.js'

const app=express();
app.use(express.json())

const port='3000';

app.get('/',()=>{
    console.log('working good');
    return "good"
})

app.use('/api',jobRoutes);

app.listen(port,()=>{
    console.log('app running successfully with port 3000');
})