import { EmptyParams, IPacket } from '../interfaces';

const message: IPacket<EmptyParams> = {
  name: 'S_REQUEST_PARCEL_MESSAGES',
  version: 1,
  params: {
    $$strict: true,
  },
  run(connection, payload) {
    // handler goes here
  },
};

export default message;
