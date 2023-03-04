import express from 'express';

import { User } from 'src/domains/users/schemas';

declare module 'express' {
  interface Request extends express.Request {
    user: User;
  }

  interface Response extends express.Response {
    user: User;
  }
}
