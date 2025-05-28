# Mathly Backend Node.js

A Node.js Express API for the Mathly application, providing similar functionality to the Python backend but implemented with modern JavaScript/TypeScript technologies.

## Tech Stack

- **Express.js**: Web framework for Node.js
- **TypeScript**: Type-safe JavaScript
- **Prisma**: ORM for PostgreSQL
- **Zod**: Schema validation
- **JWT**: Authentication
- **Swagger**: API documentation

## Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env` (if available)
   - Update the `DATABASE_URL` with your PostgreSQL connection string
   - Set a secure `JWT_SECRET`

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Run database migrations:

```bash
npm run prisma:migrate
```

### Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

## API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/api/docs
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get JWT token

### Users

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Problems

- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get problem by ID
- `POST /api/problems` - Create a new problem
- `PATCH /api/problems/:id` - Update problem
- `DELETE /api/problems/:id` - Delete problem

### Solutions

- `GET /api/solutions` - Get all solutions
- `GET /api/solutions/:id` - Get solution by ID
- `POST /api/solutions` - Create a new solution
- `PATCH /api/solutions/:id` - Update solution
- `DELETE /api/solutions/:id` - Delete solution

## Project Structure

```
mathly-backend-node/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models and schemas
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── services/       # Business logic
│   ├── utils/          # Helper functions
│   └── server.ts       # Main application entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```
