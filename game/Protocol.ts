import WebSocket from 'ws';
import FastestValidator from 'fastest-validator';
import { join } from 'path';

import { readDirectory } from '../modules/FileLoader';
import { GameServer } from './GameServer';
import { IPacket } from './interfaces';

const check = Symbol('check');

export class Packet<T extends Record<string, unknown>> implements IPacket<T> {
  name: IPacket<T>['name'];
  version: IPacket<T>['version'];
  params: IPacket<T>['params'];
  run: IPacket<T>['run'];

  constructor({ name, version, params, run }: Packet<T>) {
    this.name = name;
    this.version = version;
    this.params = params;

    this.run = run?.bind(this);

    if (name.startsWith('C_') && this.run) {
      throw new Error('Messages directed to the client should not have handlers');
    }

    const validator = new FastestValidator();
    this[check] = validator.compile(params);
  }

  validate(obj: Record<string, unknown>): boolean {
    return this[check](obj) === true;
  }
}

export interface IDecodedPacket {
  userId?: string;
  packetId: number;
  version: number;
  json: Record<string, unknown>;
  packet: Packet<Record<string, unknown>>;
}

export class Protocol {
  gameServer: GameServer;
  packetsByName: Map<string, Packet<any>>;
  packetsById: Map<number, Packet<any>>;
  packetsIdByName: Map<string, number>;

  constructor(gameServer: GameServer) {
    this.gameServer = gameServer;

    this.packetsByName = new Map();
    this.packetsById = new Map();
    this.packetsIdByName = new Map<string, number>();

    // const files = fs
    //   .readdirSync(join(__dirname, 'packets'), 'utf-8')
    //   .filter((p) => p.match(/\.(js|ts)$/));

    const files = readDirectory({
      dir: join(__dirname, 'packets'),
      debug: true,
      useTypescript: true,
    });

    files.forEach((file, i) => {
      const required = module.require(file);
      const pkt = new Packet(required?.default ?? required);

      this.packetsByName.set(pkt.name, pkt);
      this.packetsById.set(i + 1, pkt);
      this.packetsIdByName.set(pkt.name, i + 1);
      console.log(i + 1, pkt.name);
    });
  }

  encode(packet = 0, version = 0, payload: Record<string, unknown>): Uint16Array {
    const str = JSON.stringify(payload);

    const codes = str.split('').map((a) => a.charCodeAt(0));

    const arr = new Uint16Array(str.length + 2);

    arr[0] = packet;
    arr[1] = version;

    codes.forEach((c, i) => (arr[i + 2] = c));

    return arr;
  }

  decode(payload: WebSocket.Data): IDecodedPacket | undefined {
    const packetId = payload[0];
    const version = payload[2];
    const packet = this.packetsById.get(packetId);

    if (!packet) {
      return undefined;
    }

    if (!Buffer.isBuffer(payload)) {
      return undefined;
    }

    try {
      const json = JSON.parse(String(payload.slice(4).filter(Boolean)).trim());
      if (!(typeof packetId === 'number') || !(typeof version === 'number')) {
        return undefined;
      }
      return { packetId, version, json, packet };
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
}
