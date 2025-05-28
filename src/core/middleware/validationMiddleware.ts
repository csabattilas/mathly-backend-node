import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import { AppError } from '../utils/appError'

/**
 * Middleware to validate request data against a Zod schema
 * @param schema The Zod schema to validate against
 * @param source Where to find the data to validate (body, query, params)
 */ export const validate = (
  schema: AnyZodObject,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await schema.parseAsync(req[source])

      req[source] = data

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }))

        next(
          new AppError(
            `Validation error: ${JSON.stringify(formattedErrors)}`,
            400
          )
        )
      } else {
        next(error)
      }
    }
  }
}
