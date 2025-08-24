# Docker Setup Guide for Expense Tracker

This guide explains how to run the expense tracker application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed
- Git (to clone the repository)

## Current Docker Setup

**Note**: The current Docker setup only includes MongoDB. The backend and frontend are designed to run locally for development.

### Services

#### 1. MongoDB (Port 27017)
- **Image**: `mongo:6.0`
- **Container Name**: `mongo_container`
- **Port**: 27017
- **Authentication**: root/root
- **Data Persistence**: Docker volume `mongo_data`
- **Restart Policy**: unless-stopped

## Quick Start

1. **Clone and navigate to the project:**
   ```bash
   cd expense-tracker
   ```

2. **Start MongoDB service:**
   ```bash
   npm run docker:up
   ```

   Or use Docker Compose directly:
   ```bash
   docker-compose up -d
   ```

3. **Start backend and frontend locally:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend  
   cd frontend
   npm start
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## Available Scripts

### Docker Management
- `npm run docker:build` - Build Docker images
- `npm run docker:up` - Start MongoDB service in detached mode
- `npm run docker:down` - Stop MongoDB service
- `npm run docker:restart` - Restart MongoDB service
- `npm run docker:clean` - Stop service and remove volumes

### Logs
- `npm run docker:logs` - View logs from all services
- `npm run docker:logs:mongodb` - View MongoDB logs only

### Development
- `npm run dev` - Start MongoDB service in foreground
- `npm run start` - Start MongoDB service in background
- `npm run stop` - Stop MongoDB service

### Installation
- `npm run install:backend` - Install backend dependencies
- `npm run install:frontend` - Install frontend dependencies
- `npm run install:all` - Install all dependencies

## Development Workflow

1. **Start MongoDB:**
   ```bash
   npm run docker:up
   ```

2. **Start backend locally:**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start frontend locally:**
   ```bash
   cd frontend
   npm start
   ```

4. **Make changes to your code** - Both backend and frontend will hot-reload automatically

## Environment Configuration

### Backend (.env file in backend directory)
```bash
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://root:root@localhost:27017/expense_tracker?authSource=admin
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=5s
```

### Frontend
- No environment variables needed for local development
- API calls go to `http://localhost:5000/api/v1`

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Ensure port 27017 is available for MongoDB
   - Ensure ports 3000 and 5000 are available for local development

2. **MongoDB connection issues:**
   - Check if MongoDB container is running: `docker ps`
   - View MongoDB logs: `npm run docker:logs:mongodb`
   - Verify connection string in backend .env file

3. **Backend not starting:**
   - Ensure MongoDB is running: `docker ps`
   - Check backend logs in terminal
   - Verify .env file configuration

4. **Frontend not starting:**
   - Check frontend logs in terminal
   - Verify all dependencies are installed: `npm run install:frontend`

### Useful Commands

```bash
# View running containers
docker ps

# View container logs
docker logs mongo_container

# Access MongoDB container shell
docker exec -it mongo_container /bin/bash

# Restart MongoDB service
docker-compose restart mongodb

# Rebuild MongoDB service
docker-compose build mongodb
```

## Data Persistence

- MongoDB data is persisted in a Docker volume named `mongo_data`
- Backend and frontend code changes are reflected immediately due to local development setup
- No need to rebuild containers for code changes

## Network Configuration

- MongoDB runs in a Docker container on port 27017
- Backend connects to MongoDB via `localhost:27017`
- Frontend connects to backend via `localhost:5000`
- All services communicate through localhost for development

## Production Considerations

For production deployment, consider:

1. **Adding backend and frontend to Docker:**
   - Create Dockerfiles for both services
   - Add them to docker-compose.yaml
   - Use production environment variables

2. **Security:**
   - Change default MongoDB credentials
   - Use proper JWT secrets
   - Configure production MongoDB settings

3. **Scaling:**
   - Use production MongoDB (Atlas, etc.)
   - Add load balancing
   - Configure proper networking

## Why This Setup?

This hybrid approach (MongoDB in Docker, services locally) provides:
- **Fast development**: No need to rebuild containers for code changes
- **Hot reloading**: Both backend and frontend reload automatically
- **Database isolation**: MongoDB runs in a controlled environment
- **Easy debugging**: Direct access to service logs and debugging tools
