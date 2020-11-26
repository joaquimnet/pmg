import { IPacket } from '../interfaces';

export type Params = {
  _id: string;
  email: string;
  username: string;
  discriminator: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

const message: IPacket<Params> = {
  name: 'C_ACCOUNT_INFO',
  version: 1,
  params: {
    _id: 'string',
    email: 'string',
    username: 'string',
    discriminator: 'number',
    role: 'string',
    createdAt: 'date',
    updatedAt: 'date',
    $$strict: true,
  },
};

export default message;
