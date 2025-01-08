import Bull from "bull";

const queue = new Bull('queue', {
    redis: { host: '127.0.0.1', port: 6379 }
})

queue.process(({id})=>{
    console.log(id,'iddddd');
    return;
})

queue.add({id:'123'})