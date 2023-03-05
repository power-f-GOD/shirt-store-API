import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { User } from 'src/domains/users/schemas';

@Injectable()
export class SocketServerService {
  server: Server;
  /**
   * A Map of socket ID's to user objects: `key` (is of type string and) is the corresponding user socket ID and `value` is a (typical) user object
   */
  users: Map<string | undefined | null, User | undefined> = new Map();
  /**
   * A Map of user ID's to socket ID's.
   */
  usersSocketIds: Map<string | undefined | null, string | undefined> =
    new Map();
}
