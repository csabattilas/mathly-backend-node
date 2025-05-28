import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/appError'
import { auth } from '../config/firebase'
import { logger } from '../utils/logger'

/**
 * Middleware to protect routes that require authentication
 * @param req The request object
 * @param res The response object
 * @param next The next middleware function
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let idToken
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    idToken = req.headers.authorization.split(' ')[1]
  }

  if (!idToken) {
    return next(
      new AppError('You are not logged in. Please log in to get access', 401)
    )
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken)

    req.firebaseUser = decodedToken

    next()
  } catch (error: any) {
    logger.error('Auth error:', error)

    let message = 'Invalid token. Please log in again'
    if (error.code === 'auth/id-token-expired') {
      message = 'Your session has expired. Please log in again'
    }

    return next(new AppError(message, 401))
  }
}
