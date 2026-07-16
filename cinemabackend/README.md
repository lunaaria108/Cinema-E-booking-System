# Cinema E-Booking System

## Prerequisites

* Java 21 (or the version used by the project)
* Maven
* Docker Desktop

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/lunaaria108/Cinema-E-booking-System.git
cd Cinema-E-booking-System
cd cinemabackend
```

### 2. Start the PostgreSQL database

First open the Docker client, then run
```bash
docker compose up -d
```

This will create the PostgreSQL database and initialize it using the SQL files in the `database/` directory.

### 3. Run the Spring Boot application

Using Maven:

```bash
./mvnw spring-boot:run
```

### Testing the mail service
Go to localhost:8025 in your browser to access the MailHog web interface. You can view the emails sent by the application here.
## Resetting the Database

If the database schema changes, recreate the database by running:

```bash
docker compose down -v
docker compose up -d
```

> **Warning:** This deletes all existing data and recreates the database from the SQL scripts.

## Stopping the Database

```bash
docker compose down
```
