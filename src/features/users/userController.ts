import { Request, Response } from 'express'
import prisma from '../../core/lib/prisma'
import { AppError } from '../../core/utils/appError'
import { CreateUserInput } from './user.types'
import { PaginationQuery } from '../../schemas/common/paginationSchema'

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: id
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationResponse'
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 */
export const getAllUsers = async (req: Request, res: Response) => {
  // Get pagination parameters from request query
  const { page, limit, sort, order } = req.query as unknown as PaginationQuery

  // Calculate skip value for pagination
  const skip = (page - 1) * limit

  // Get total count for pagination metadata
  const total = await prisma.users.count()

  // Get users with pagination
  const users = await prisma.users.findMany({
    skip,
    take: limit,
    orderBy: {
      [sort as string]: order,
    },
  })

  res.status(200).json({
    status: 'success',
    results: users.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    data: { users },
  })
}

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: User already exists
 */
export const createUser = async (req: Request<{}, {}, CreateUserInput>, res: Response) => {
  const firebaseUser = req.firebaseUser

  if (!firebaseUser || !firebaseUser.uid) {
    throw new AppError('Invalid Firebase user data', 400)
  }

  const { email, name } = req.body

  if (!email) {
    throw new AppError('Email is required', 400)
  }

  const existingUser = await prisma.users.findUnique({
    where: { firebase_uid: firebaseUser.uid },
  })

  if (existingUser) {
    throw new AppError('User already exists', 409)
  }

  try {
    const newUser = await prisma.users.create({
      data: {
        firebase_uid: firebaseUser.uid,
        email,
        name: name || null,
      },
    })

    res.status(201).json({
      status: 'success',
      data: { user: newUser },
    })
  } catch (error) {
    throw new AppError(
      `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    )
  }
}

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  const firebaseUser = req.firebaseUser

  if (!firebaseUser || !firebaseUser.uid) {
    throw new AppError('Invalid Firebase user data', 400)
  }

  try {
    const user = await prisma.users.findUnique({
      where: { firebase_uid: firebaseUser.uid },
    })

    if (!user) {
      throw new AppError('User not found', 404)
    }

    const { firebase_uid, ...userWithoutFirebaseId } = user
    res.status(200).json({
      status: 'success',
      data: { user: userWithoutFirebaseId },
    })
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw new AppError(
      `Failed to get user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    )
  }
}
