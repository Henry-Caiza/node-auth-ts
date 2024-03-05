import { Request, Response } from "express";
import { hashPassword } from "../services/password.service"
import prisma from '../models/user'

export const createUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body

        if (!email) {
            res.status(400).json({ message: "email required" })
            return
        }
        if (!password) {
            res.status(400).json({ password: "password required" })
            return
        }

        const hashedPassword = await hashPassword(password)
        const user = await prisma.create({
            data: {
                email,
                password: hashedPassword
            }
        })
        res.status(201).json(user)
    } catch (error: any) {
        console.log(error);

        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: "email ingresado ya existe" })
        }

        res.status(500).json({ message: 'error en el registro' })
    }
}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.findMany()
        res.status(200).json(users)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error en el registro' })
    }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {

    const userId = parseInt(req.params.id)
    try {
        const user = await prisma.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            res.status(404).json({ message: 'El usuario no existe' })
            return
        }
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error en el registro' })
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {

    const userId = parseInt(req.params.id)
    const { email, password } = req.body
    try {
        let dataToUpdate: any = {
            ...req.body
        }
        if (password) {
            const hashedPassword = await hashPassword(password)
            dataToUpdate.password = hashedPassword
        }
        if (email) {
            dataToUpdate.email = email
        }
        const user = await prisma.update({
            where: {
                id: userId
            },
            data: dataToUpdate
        })

        res.status(200).json(user)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: "email ingresado ya existe" })
        } else if (error?.code === 'P2025') {
            res.status(404).json({ message: "usuario no encontrado" })
        }
        else
            res.status(500).json({ message: 'error en el update' })
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {

    const userId = parseInt(req.params.id)
    try {
        await prisma.delete({
            where: {
                id: userId
            }
        })
        res.status(200).json({ message: `El usuario ${userId} ha sido elimando` }).end()
    } catch (error: any) {
        if (error?.code === 'P2025') {
            res.status(404).json({ message: "usuario no encontrado" })
        }
        else
            res.status(500).json({ message: 'error en el delete' })
    }
}