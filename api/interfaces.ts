import { RequestHandler } from 'express';
import { ValidationSchema } from 'fastest-validator';

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
  actions: Record<string, IPonaservAction>;
  methods?: Record<string, (...args: any[]) => any>;
}
