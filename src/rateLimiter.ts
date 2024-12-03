import { subMilliseconds } from "date-fns";
import { NextFunction, Request, Response } from "express";
import { collections } from "mongo";
import { v4 } from "uuid";

type RateLimitConfig = {
  windowMs: number;
  maxRequests: number;
};

export const createRateLimiter = (config: RateLimitConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const now = new Date();
    const windowStart = subMilliseconds(now, config.windowMs);

    const requesterId = req.ip || "UNKNOWN";

    const requestCount = await collections.requests.countDocuments({
      requesterId,
      createdAt: { $gt: windowStart },
    });

    if (requestCount >= config.maxRequests) {
      res.status(429).json({
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please try again later.",
      });
      return;
    }

    await collections.requests.insertOne({
      _id: v4(),
      requesterId,
      createdAt: now,
    });

    next();
  };
};
