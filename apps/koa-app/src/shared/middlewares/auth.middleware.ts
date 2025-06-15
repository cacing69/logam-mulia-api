import { Context, Next } from 'koa';
import { verifyToken } from '../utils/jwt.util';
import { errorResponse } from '../utils/response.util';

export const auth = async (ctx: Context, next: Next) => {
    const authHeader = ctx.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(ctx, null, 'Unauthorized : Missing bearer token', 401);
    }

    const token = authHeader.split(' ')[1];

    // if (isBlacklisted(token)) {
    //     return errorResponse(ctx, 'Token has been revoked', 401);
    // }

    try {
        const decoded = verifyToken(token);
        ctx.state.user = decoded;
        await next();
    } catch (e) {
        return errorResponse(ctx, null,'Unauthorized : Invalid or expired token', 401);
    }
}