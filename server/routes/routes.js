import { Router } from 'express'
import { createUser, deleteUser, getAllUsers, getOneUser, updateUser, updateUserNoPass, searchAvailableUser } from '../controllers/UsersController.js'

const router = Router()

// Routes
router.get('/', getAllUsers)
router.post('/', createUser)
router.get('/search/available', searchAvailableUser)
router.get('/:id', getOneUser)
router.patch('/:id/nopwd', updateUserNoPass)
router.patch('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
