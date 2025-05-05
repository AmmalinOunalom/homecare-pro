// custom.d.ts (or any other TypeScript declaration file)

import { User } from './models/user.model'; // Adjust path as needed

declare global {
  namespace Express {
    interface Request {
      user?: User;  // Add the user property to the Request object
    }
  }
}
