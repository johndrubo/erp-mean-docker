# ERP MEAN Docker

This repository contains a full-stack ERP application using the MEAN stack (MongoDB, Express, Angular, Node.js) with Docker for containerization.

## Structure

- `backend/` - Node.js/Express API
- `frontend/` - Angular SPA
- `nginx/` - Nginx config for serving frontend
- `docker-compose.yml` - Multi-container orchestration

## Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd erp-mean-docker
   ```

2. **Configure environment variables:**
   - Copy `backend/.env.example` to `backend/.env` and update values as needed.

3. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build -d
   ```

4. **Access the app:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000

## Notes
- Do **not** commit sensitive data (like real `.env` files) to the repository.
- Add your own `.env` files locally as needed.

## License
MIT
