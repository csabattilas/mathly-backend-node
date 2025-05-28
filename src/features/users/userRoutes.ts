import express from 'express'
import { getCurrentUser, createUser, getAllUsers } from './userController'
import { validate } from '../../core/middleware/validationMiddleware'
import { userCreateSchema } from './userSchemas'
import { paginationSchema } from '../../schemas/common/paginationSchema'

const router = express.Router()

router.route('/')
  .get(validate(paginationSchema, 'query'), getAllUsers)
  .post(validate(userCreateSchema), createUser)

router.route('/me').get(getCurrentUser)

export default router
