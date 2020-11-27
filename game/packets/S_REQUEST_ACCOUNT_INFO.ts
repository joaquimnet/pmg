import { EmptyParams, IPacket } from '../interfaces';
import Models from '../../models';
import { Params } from './C_ACCOUNT_INFO';

const User = Models.get('User')!;

const message: IPacket<EmptyParams> = {
  name: 'S_REQUEST_ACCOUNT_INFO',
  version: 1,
  params: {
    $$strict: true,
  },
  async run(connection, payload) {
    const userDoc = await User.findById(connection.socket.game.userId);
    const user = userDoc.safe();
    delete user.achievements;
    delete user.friends;

    connection.send<Params>('C_ACCOUNT_INFO', user);
  },
};

export default message;
