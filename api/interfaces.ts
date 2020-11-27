import { NextFunction, Response, Request } from 'express';
import { ValidationSchema } from 'fastest-validator';

declare module 'express' {
  // eslint-disable-next-line no-shadow
  export interface Request {
    session: typeof import('../config/sessionStore').sessionStore & {
      user?: typeof import('mongoose').Model;
      userId?: string;
    };
  }
}

export type RequestHandler = (req: Request, res: Response<any>, next: NextFunction) => void;

export type IPonaservAction =
  | RequestHandler
  | {
      middleware?: RequestHandler[];
      params?: ValidationSchema;
      handler: RequestHandler;
    };

export interface IPonaservService {
  name: string;
  routes: Record<string, string>;
  actions: Record<string | number | symbol, IPonaservAction>;
  methods?: Record<string | number | symbol, (...args: any[]) => any>;
}

export type IPonaservVirtualService = IPonaservService &
  Pick<IPonaservService['actions'], keyof IPonaservService['actions']> &
  Pick<IPonaservService['methods'], keyof IPonaservService['methods']>;
