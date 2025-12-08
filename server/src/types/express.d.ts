import { UserPayload } from "../types/auth"; // optional, if you want a custom type

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string | number;
        email: string;
        username: string;
      };
    }
  }
}
