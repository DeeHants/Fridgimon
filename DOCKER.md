# Docker Setup for Fridgimon

This project is configured to run in Docker with PHP/Apache and MariaDB containers.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### 1. Start the containers

```bash
docker-compose up -d
```

This will:
- Build the PHP/Apache image
- Start MariaDB container and initialize the database schema
- Start PHP/Apache container
- Create a shared network between containers

### 2. Access the application

- **Web Application**: http://localhost
- **Database**: localhost:3306
  - Username: `fridgimon`
  - Password: `hunter2`
  - Database: `fridgimon`

### 3. Stop the containers

```bash
docker-compose down
```

To remove the database volume as well (delete all data):

```bash
docker-compose down -v
```

## Configuration

### Database Credentials

Default credentials are set in `docker-compose.yml`:
- **User**: fridgimon
- **Password**: hunter2
- **Database**: fridgimon
- **Root Password**: root_hunter2

To change these, edit the environment variables in `docker-compose.yml` before running `docker-compose up`.

### PHP Configuration

The PHP container uses:
- PHP 8.2
- Apache 2.4
- Extensions: mysqli, PDO, PDO_MySQL

The `db.inc.php` file is generated with environment variables, so the PHP application automatically connects to the MariaDB container.

## Useful Commands

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f php
docker-compose logs -f mariadb
```

### Access PHP container shell
```bash
docker-compose exec php bash
```

### Access MariaDB shell
```bash
docker-compose exec mariadb mariadb -u fridgimon -p fridgimon
```

### Rebuild the PHP image (after Dockerfile changes)
```bash
docker-compose up -d --build
```

## Data Persistence

Database data is stored in a Docker volume named `mariadb_data`. This ensures data persists across container restarts.

## Troubleshooting

### Database connection fails
- Check that MariaDB container is healthy: `docker-compose ps`
- View MariaDB logs: `docker-compose logs mariadb`
- Ensure the database initialization completed: check for `01-schema.sql` in logs

### PHP shows blank page
- Check PHP logs: `docker-compose logs php`
- Verify db.inc.php was created: `docker-compose exec php cat db.inc.php`

### Port 80 already in use
- Change the port mapping in `docker-compose.yml` (e.g., `"8080:80"`)
- Then access the app at http://localhost:8080

## Development Workflow

For development, the `./src/webapp` directory is mounted as a volume, so:
- Changes to PHP files are immediately reflected
- Changes to React components require rebuilding to `lib/` directory (run `npm run build`)

To rebuild React files in the container:
```bash
docker-compose exec php npm install
docker-compose exec php npm run build
```
