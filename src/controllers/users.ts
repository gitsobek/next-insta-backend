import { Request, Response, NextFunction } from 'express';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).send({
    message: 'All users have been successfully fetched.',
    data: [],
  });
};
