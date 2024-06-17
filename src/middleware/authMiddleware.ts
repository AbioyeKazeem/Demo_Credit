import { Request, Response, NextFunction } from 'express';

export const fauxAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    if (token === 'FAKE_TOKEN') {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
