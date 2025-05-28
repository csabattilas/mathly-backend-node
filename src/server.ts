import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import 'express-async-errors'

import { logger, requestLogger } from './core/utils/logger'

import { errorHandler } from './core/middleware/errorHandler'
import { notFoundHandler } from './core/middleware/notFoundHandler'
import { protect } from './core/middleware/authMiddleware'
import { apiLimiter, authLimiter } from './core/middleware/rateLimiter'

import userRoutes from './features/users/userRoutes'
import docsRoutes from './features/docs/docsRoutes'
import healthRoutes from './features/health/healthRoutes'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(helmet())
app.use(
  cors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(requestLogger)

// Apply rate limiting to all requests
app.use(apiLimiter)

// Apply stricter rate limiting to auth endpoints (if any)
// app.use('/api/v1/auth', authLimiter)

// Health check endpoint - no auth required
app.use('/api/v1/health', healthRoutes)

// API documentation - no auth required
app.use('/api/docs', docsRoutes)

app.use('/api', protect)

app.use('/api/v1/users', userRoutes)

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Mathly API',
    documentation: '/api/docs',
    protectedEndpoints: 'All /api/* routes require authentication except /api/docs',
  })
})

app.use('*', notFoundHandler)
app.use(errorHandler as express.ErrorRequestHandler)

process.on('uncaughtException', error => {
  logger.error('UNCAUGHT EXCEPTION! 🔴 Logging error but keeping server running:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
  })
})

process.on('unhandledRejection', (error: Error) => {
  logger.error('UNHANDLED REJECTION! 🔴 Logging error but keeping server running:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
  })
})

const server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`)
})

process.once('SIGINT', () => {
  logger.info('SIGINT received, closing server gracefully')
  server.close(() => {
    logger.info('Server closed')
  })
})

process.once('SIGTERM', () => {
  logger.info('SIGTERM received, closing server gracefully')
  server.close(() => {
    logger.info('Server closed')
  })
})

export default app
