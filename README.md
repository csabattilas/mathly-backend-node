# Mathly Backend Node.js

A Node.js Express API for the Mathly application built with modern JavaScript/TypeScript technologies.

## Tech Stack

- **Express.js**: Web framework for Node.js
- **TypeScript**: Type-safe JavaScript with modern NodeNext module resolution
- **Prisma**: ORM for PostgreSQL
- **Zod**: Schema validation and request sanitization
- **Firebase Auth**: Authentication and authorization
- **Swagger/OpenAPI**: API documentation
- **Jest**: Testing framework
- **ESLint/Prettier**: Code quality and formatting

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- Firebase project (for authentication)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env` (if available)
   - Update the `DATABASE_URL` with your PostgreSQL connection string
   - Configure Firebase credentials

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

Debug mode:

```bash
npm run dev:debug
```

Production mode:

```bash
npm run build
npm start
```

### Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Code Quality

Lint code:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

## API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/api/docs
```

The API includes endpoints for user management and authentication with Firebase.

## Project Structure

```
mathly-backend-node/
├── src/
│   ├── core/
│   │   ├── config/     # Configuration files (Firebase, etc.)
│   │   ├── lib/        # Library integrations (Prisma, etc.)
│   │   ├── middleware/ # Custom middleware (auth, validation, etc.)
│   │   ├── types/      # TypeScript type definitions
│   │   └── utils/      # Helper functions and utilities
│   ├── features/       # Feature modules
│   │   ├── docs/       # API documentation
│   │   ├── health/     # Health check endpoints
│   │   └── users/      # User management
│   ├── schemas/        # Zod validation schemas
│   └── server.ts       # Main application entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── __tests__/          # Test files
├── .env                # Environment variables
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
├── jest.config.js      # Jest configuration
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Features

- **Type Safety**: Full TypeScript implementation
- **Validation**: Request validation with Zod
- **Authentication**: Firebase authentication integration
- **API Documentation**: Swagger/OpenAPI documentation
- **Testing**: Jest testing framework
- **Code Quality**: ESLint and Prettier integration
- **Rate Limiting**: Protection against abuse
- **Pagination**: Standardized pagination for list endpoints
- **Health Checks**: Endpoint for monitoring
- **Error Handling**: Consistent error responses
