import { EmptyParams, IPacket } from '../interfaces';

const message: IPacket<EmptyParams> = {
  name: 'S_LOGOUT',
  version: 1,
  params: {
    $$strict: true,
  },
  run(connection) {
    console.log(`Logout requested for user ${connection.socket.game.userId}`);
    connection.logout(connection.socket.game.userId!, true);
  },
};

export default message;
