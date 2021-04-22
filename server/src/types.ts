import { Redis } from 'ioredis';
import { Request, Response } from 'express';
import { Session } from 'express-session';

export type MyContext = {
	req: Request & { session: Session };
	redis: Redis;
	res: Response;
};

declare module 'express-session' {
	interface SessionData {
		userId: number;
	}
}
