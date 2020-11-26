import { ValidationSchema } from 'fastest-validator';
import { ClientConnection } from './ClientConnection';

export interface IPacket<T extends Record<string, unknown>> {
  name: string;
  version: number;
  params: ValidationSchema;
  run?: (connection: ClientConnection, payload: T) => void;
}

export type EmptyParams = {
  $$strict: true;
}

// export const a: ProtocolMessage<{
//   hello: string;
// }> = {
//   name: 'bingo',
//   version: 1,
//   params: {
//     hello: 'string',
//   },
//   run(s, p) {
//     p.hello;
//   },
// };
