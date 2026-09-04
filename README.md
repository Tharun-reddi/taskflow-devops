# TaskFlow — CI/CD Practice Project

A deliberately UNDEPLOYED full-stack application for learning DevOps and CI/CD.

Stack: React + Vite, Node.js + Express, MongoDB, Docker, GitHub Actions.

## Run locally

### 1. Start MongoDB
Use local MongoDB or:
docker compose up --build

### 2. Backend
cd backend
npm install
npm run dev

### 3. Frontend
cd frontend
npm install
npm run dev

Frontend: http://localhost:5173
Backend: http://localhost:5000

## CI/CD roadmap
1. Run locally
2. Push to GitHub
3. Understand GitHub Actions CI
4. Dockerize
5. Push images to Docker Hub
6. Create AWS EC2
7. Add continuous deployment

No cloud credentials or deployment configuration are included.
