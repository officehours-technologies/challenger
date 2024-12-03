import express, { NextFunction, Request, Response } from "express";
import { createRateLimiter } from "rateLimiter";

declare global {
  namespace Express {
    export interface Request {
      userId: string | null;
    }
  }
}

export const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.userId = (req.headers["x-user-id"] || null) as string | null;
  next();
});

app.get<string, never, { success: true }, never, never>(
  "/foo",
  createRateLimiter({ windowMs: 30 * 1000, maxRequests: 3 }),
  async (req: Request, res: Response) => {
    res.json({ success: true });
  }
);

app.get<string, never, { success: true }, never, never>(
  "/bar",
  createRateLimiter({ windowMs: 20 * 1000, maxRequests: 2 }),
  async (req: Request, res: Response) => {
    res.json({ success: true });
  }
);
