import { Request, Response } from 'express'
import { getCurrentUser } from '../../../features/users/userController'
import prisma from '../../../core/lib/prisma'
import { AppError } from '../../../core/utils/appError'

declare global {
  namespace Express {
    interface Request {
      firebaseUser?: {
        uid: string
        email?: string
      }
    }
  }
}

jest.mock('../../../core/lib/prisma', () => ({
  users: {
    findUnique: jest.fn(),
  },
}))

describe('User Controller', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: jest.Mock

  beforeEach(() => {
    mockRequest = {
      firebaseUser: {
        uid: 'test-firebase-uid',
        email: 'test@example.com',
      },
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    mockNext = jest.fn()
    jest.clearAllMocks()
  })

  describe('getCurrentUser', () => {
    it('should return user without firebase_uid when user exists', async () => {
      const mockUser = {
        id: 1,
        firebase_uid: 'test-firebase-uid',
        email: 'test@example.com',
        name: 'Test User',
      }

      // Mock the Prisma findUnique method
      ;(prisma.users.findUnique as jest.Mock).mockResolvedValue(mockUser)

      await getCurrentUser(mockRequest as Request, mockResponse as Response)

      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { firebase_uid: 'test-firebase-uid' },
      })
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          user: {
            id: 1,
            email: 'test@example.com',
            name: 'Test User',
          },
        },
      })
    })

    it('should throw 404 error when user does not exist', async () => {
      // Mock the Prisma findUnique method to return null
      ;(prisma.users.findUnique as jest.Mock).mockResolvedValue(null)

      try {
        await getCurrentUser(mockRequest as Request, mockResponse as Response)
        // If we get here, the test should fail
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        expect((error as AppError).message).toBe('User not found')
        expect((error as AppError).statusCode).toBe(404)
      }

      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { firebase_uid: 'test-firebase-uid' },
      })
    })

    it('should throw 400 error when firebase user is invalid', async () => {
      mockRequest.firebaseUser = undefined

      try {
        await getCurrentUser(mockRequest as Request, mockResponse as Response)
        // If we get here, the test should fail
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(AppError)
        expect((error as AppError).message).toBe('Invalid Firebase user data')
        expect((error as AppError).statusCode).toBe(400)
      }
    })
  })
})
