import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../dataBase/User.model';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        const user = await User.findById((decoded as any).userId);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });
        (req as any).user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
