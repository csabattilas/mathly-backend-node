import express from 'express'
import { checkHealth } from './healthController'

const router = express.Router()

router.get('/', checkHealth)

export default router
