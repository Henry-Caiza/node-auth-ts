import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { createUsers, deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/usersController'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'No autorizado' })
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error en la autenticacion: ', err)
            return res.status(403).json({ message: 'No tienes acceso a este recurso' })
        }
        next()
    })

}

router.post('/', authenticateToken, createUsers)
router.get('/', authenticateToken, getAllUsers)
router.get('/:id', authenticateToken, getUserById)
router.put('/:id', authenticateToken, updateUser)
router.delete('/:id', authenticateToken, deleteUser)


export default router