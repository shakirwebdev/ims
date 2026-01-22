# IMS - Inventory Management System

A full-stack application with Laravel backend, React frontend, and MySQL database, all containerized with Docker.

## Prerequisites

- Docker Desktop installed on your machine
- Git (optional, for version control)

## Project Structure

```
ims/
├── backend/              # Laravel application
│   ├── Dockerfile
│   ├── .env.example
│   └── ...
├── frontend/             # React application
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   └── src/
├── docker-compose.yml    # Docker orchestration
└── README.md
```

## Quick Start

### 1. Initial Setup - Create Laravel Project

First, you need to create a Laravel project in the backend directory:

```bash
# Navigate to the backend directory
cd backend

# Create a new Laravel project (requires Composer)
composer create-project laravel/laravel .

# Or if you don't have Composer installed locally, use Docker:
docker run --rm -v $(pwd):/app composer create-project laravel/laravel .

# Copy the environment file
cp .env.example .env

# Return to project root
cd ..
```

### 2. Start the Application

From the project root directory:

```bash
# Build and start all containers
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 3. Initialize Laravel

After containers are running, initialize Laravel in a new terminal:

```bash
# Generate application key
docker-compose exec backend php artisan key:generate

# Run migrations
docker-compose exec backend php artisan migrate

# Create health check API route
docker-compose exec backend php artisan make:controller HealthController
```

Add this to `backend/app/Http/Controllers/HealthController.php`:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HealthController extends Controller
{
    public function check()
    {
        return response()->json([
            'status' => 'ok',
            'message' => 'Backend API is running',
            'timestamp' => now()
        ]);
    }
}
```

Add this to `backend/routes/api.php`:

```php
use App\Http\Controllers\HealthController;

Route::get('/health', [HealthController::class, 'check']);
```

Enable CORS by running:

```bash
docker-compose exec backend php artisan config:publish cors
```

Update `backend/config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

## Access the Application

- **Frontend (React)**: http://localhost:3000
- **Backend API (Laravel)**: http://localhost:8000
- **MySQL Database**: localhost:3306
  - Database: `ims_db`
  - Username: `ims_user`
  - Password: `password`
  - Root Password: `root`

## Common Docker Commands

```bash
# Start containers
docker-compose up

# Start in background
docker-compose up -d

# Stop containers
docker-compose down

# Rebuild containers
docker-compose up --build

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend

# Execute commands in backend container
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan make:model Product -m
docker-compose exec backend composer install

# Execute commands in frontend container
docker-compose exec frontend npm install <package-name>

# Access MySQL
docker-compose exec mysql mysql -u ims_user -ppassword ims_db

# Remove all containers and volumes
docker-compose down -v
```

## Development Workflow

### Backend Development

1. Laravel files are in the `backend/` directory
2. Any changes to PHP files are automatically reflected
3. Add API routes in `backend/routes/api.php`
4. Create controllers: `docker-compose exec backend php artisan make:controller ControllerName`
5. Create models: `docker-compose exec backend php artisan make:model ModelName -m`

### Frontend Development

1. React files are in the `frontend/src/` directory
2. Changes are automatically hot-reloaded
3. Add new packages: `docker-compose exec frontend npm install <package-name>`
4. API calls should use `process.env.REACT_APP_API_URL` as the base URL

## Troubleshooting

### Port Already in Use

If you get port conflicts:

```bash
# Change ports in docker-compose.yml
# For example, change "3000:3000" to "3001:3000"
```

### Permission Issues

If you encounter permission issues:

```bash
# Fix permissions for Laravel
docker-compose exec backend chown -R www-data:www-data /var/www/storage
docker-compose exec backend chmod -R 755 /var/www/storage
```

### Database Connection Issues

```bash
# Restart MySQL container
docker-compose restart mysql

# Check MySQL logs
docker-compose logs mysql
```

### Clear Laravel Cache

```bash
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan route:clear
```

## Environment Variables

### Backend (.env)

Located in `backend/.env`:
- `DB_HOST=mysql` (container name)
- `DB_DATABASE=ims_db`
- `DB_USERNAME=ims_user`
- `DB_PASSWORD=password`

### Frontend

API URL is set in `docker-compose.yml`:
- `REACT_APP_API_URL=http://localhost:8000/api`

## Production Deployment

For production deployment:

1. Update `docker-compose.yml` environment to `production`
2. Change database passwords and credentials
3. Set `APP_DEBUG=false` in Laravel `.env`
4. Build optimized React: `npm run build`
5. Use proper web server (Nginx/Apache) instead of development servers

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is open-source and available under the MIT License.