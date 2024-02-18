import { Request, Response } from 'express';
import { registerUser, loginUser, getUsers, changeUserBoss } from '../services/user.service';

export const registerUserController = async (req: Request, res: Response) => {
    try {
        const { username, password, role, bossId } = req.body;
        const message = await registerUser(username, password, role, bossId);
        console.log(message, 'message');
        res.status(201).json({ message });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUserController = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const token = await loginUser(username, password);
        res.json({ token });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getUsersController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const users = await getUsers(user);
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const changeUserBossController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const { userId } = req.params;
        const { bossId } = req.body;
        const message = await changeUserBoss(user, userId, bossId);
        res.json({ message });
    } catch (error: any) {
        res.status(500).json({ message: error.message as any });
    }
};
