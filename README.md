# IMS - Inventory Management System

A full-stack Inventory Management System with Laravel backend, React frontend, and MySQL database, all containerized with Docker.

## Features

- ✅ **Item Management**: Create, read, update, and delete inventory items
- ✅ **Real-time Validation**: Form validation with required fields and constraints
- ✅ **Health Monitoring**: System health check page
- ✅ **Responsive UI**: Modern, mobile-friendly interface
- ✅ **RESTful API**: Laravel backend with API endpoints
- ✅ **Dockerized**: Easy deployment with Docker Compose

## Prerequisites

- Docker Desktop installed and running
- That's it! Everything else is containerized.

## Quick Start

### 1. Clone or download this repository

```bash
git clone <repository-url>
cd ims
```

### 2. Start the application

```bash
docker compose up -d
```

That's it! The application will:
- Build all necessary containers
- Set up the database
- Start the Laravel backend
- Start the React frontend

### 3. Access the application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001/api
- **Health Check**: http://localhost:3000/health

### 4. Stop the application

```bash
docker compose down
```

## Project Structure

```
ims/
├── backend/              # Laravel 12 application
│   ├── app/
│   │   ├── Models/       # Item model
│   │   └── Http/Controllers/  # API controllers
│   ├── database/migrations/   # Database schema
│   └── routes/api.php    # API routes
├── frontend/             # React 18 application
│   ├── src/
│   │   ├── components/   # Inventory & HealthCheck components
│   │   ├── App.js        # Main app with routing
│   │   └── App.css       # Styling
│   └── package.json
├── docker-compose.yml    # Docker orchestration
└── README.md
```

## API Endpoints

### Items
- `GET /api/items` - Get all items
- `POST /api/items` - Create new item
  - Body: `{ "name": "string", "quantity": number }`
- `GET /api/items/{id}` - Get single item
- `PUT /api/items/{id}` - Update item
  - Body: `{ "name": "string", "quantity": number }`
- `DELETE /api/items/{id}` - Delete item

### System
- `GET /api/health` - Health check endpoint

## Ports Configuration

The application uses these ports to avoid conflicts with Laravel Herd and DBngin:

- **Frontend**: 3000
- **Backend**: 8001
- **MySQL**: 3307

## Common Commands

```bash
# Start containers
docker compose up -d

# Stop containers
docker compose down

# View logs
docker compose logs -f

# View specific service logs
docker compose logs backend
docker compose logs frontend

# Restart containers
docker compose restart

# Execute Laravel commands
docker compose exec backend php artisan migrate
docker compose exec backend php artisan make:model ModelName -m

# Access MySQL
docker compose exec mysql mysql -u ims_user -ppassword ims_db

# Remove everything including data
docker compose down -v
```

## Development

### Backend Development

Laravel files are in the `backend/` directory. After making changes:

```bash
# Clear cache
docker compose exec backend php artisan config:clear
docker compose exec backend php artisan cache:clear

# Run migrations
docker compose exec backend php artisan migrate

# Create new model
docker compose exec backend php artisan make:model ModelName -m
```

### Frontend Development

React files are in `frontend/src/`. Changes are automatically hot-reloaded.

```bash
# Install new package
docker compose exec frontend npm install package-name
```

## Database Connection

If you need to connect external tools (e.g., DBeaver, TablePlus):

- **Host**: localhost
- **Port**: 3307
- **Database**: ims_db
- **Username**: ims_user
- **Password**: password

## Troubleshooting

### Containers won't start
```bash
# Make sure Docker Desktop is running
# Check if ports are available
lsof -i :3000 -i :8001 -i :3307

# Remove old containers and restart
docker compose down
docker compose up -d --build
```

### Backend errors
```bash
# Check logs
docker compose logs backend

# Clear Laravel cache
docker compose exec backend php artisan config:clear
docker compose exec backend php artisan cache:clear
```

### Frontend can't connect to backend
- Make sure all containers are running: `docker compose ps`
- Check backend logs: `docker compose logs backend`
- Verify API is responding: `curl http://localhost:8001/api/health`

## Technologies Used

- **Backend**: Laravel 12, PHP 8.4
- **Frontend**: React 18, Axios, React Router
- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose

## License

This project is open-source and available under the MIT License.