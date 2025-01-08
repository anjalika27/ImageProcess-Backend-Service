# ImageProcess-Backend-Service

## Description:
- Tech Stack: Node.js, Express, Axios, Docker.
- APIs:
    - Submit Job: Validates input, creates a job, and starts image processing.
    - Process Job: Simulates image downloading and GPU processing, calculates perimeter, and handles errors.
    - Get Job Status: Returns the current status of a job.
- Implementation Highlights:
    - Postgres DB storage for job data.
    - Random sleep (0.1–0.4s) for GPU processing simulation.
    - Handles errors for missing fields or non-existent jobs.
- Deployment:
    - Can run locally (npm run dev) or using Docker (docker build & docker run).
- Used Bull library to implement jobs 

## Assumptions:
- All data passed as body of request or query in apis are valid
- Each visit will contain valid store_id, image_url, visit_time
- image url passed is valid and refer to an accessible image

## Setup Project:
- add .env file details:
    - DB_USER
    - DB_HOST,
    - DB_DATABASE,
    - DB_PASSWORD,
    - DB_PORT,
- git clone https://github.com/anjalika27/ImageProcess-Backend-Service.git
- get into the right folder in which the project is cloned
- npm i
- npm run dev

First start docker then project
- docker run --name redis-server -d -p 6379:6379 redis:latest

Server runs at http://localhost:3000.

## Brief description of working environment:
- Windows 11 (OS)
- Vscode (IDE)
- library packages used:
    - axios
    - bull
    - bullmq
    - cors
    - dotenv
    - express
    - nodemon
    - pg
    - redis
    - sharp
    - uui

## Future Scope of improvement:
- add JWT tokens so only registered users can add a job
- load balancing when there are many request and server gets loaded
- frontend dashboard
- caching frequently used image data to show 