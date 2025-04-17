# JWT Auth + Finances API

A backend application built with **Node.js**, **Express**, and **Sequelize**, providing secure user authentication with **JWT** and a set of protected finance-related endpoints. Includes automated tests and optional PostgreSQL support via **Docker Compose**.

---

## Features

- **User registration and login**
- **JWT-based authentication**
- **Finance management API** (create, update, list, delete)
- **Automated integration tests** with Jest + Supertest
- **PostgreSQL ready** with Docker Compose support
- **SQLite in-memory** during tests for fast and isolated runs

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/andregamores/node-jwt.git
cd node-jwt
```

### 2. Install dependencies

```bash
npm install
```

---

## Configuration

You can customize the app using a `config.js` file (or via environment variables if preferred). For testing, a mock config is used that points to SQLite in-memory.

Example config:

```js
module.exports = {
  secret_key: 'YOUR_SECRET_KEY',
  enviroment: 'PROD',
  database: {
    name: 'agenda_db',
    user: 'postgres',
    password: 'yourpassword',
    options: {
      host: 'localhost',
      dialect: 'postgres',
    },
  },
};
```

---

## Run with Docker + PostgreSQL

```bash
docker-compose up
```

This will:

- Launch a PostgreSQL container
- Bind to port `5432`
- Create a volume for persistent data

> Make sure to point your `config.js` to use:
> - `host: 'localhost'`
> - `dialect: 'postgres'`

---

## Authentication

All protected routes require an `Authorization` header:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Endpoints

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| POST   | `/api/register`  | Register a new user      |
| POST   | `/api/authenticate` | Login and get token   |
| GET    | `/api/finances`  | List all user finances   |
| POST   | `/api/finance`   | Create a finance record  |
| PUT    | `/api/finance/:id` | Update a finance        |
| DELETE | `/api/finance/:id` | Remove a finance        |

---

## Run Tests

```bash
npm test
```

This uses `sqlite:memory` to ensure a fresh, isolated DB for each test run.

---

## License

MIT License

---

## Contributing

Pull requests are welcome! Feel free to open issues or suggest features.

