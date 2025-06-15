import { Context } from 'koa';
import { errorResponse, successResponse } from '@shared/utils/response.util';

export const handleHome = async (ctx: Context) => {
    try {

        const data = {
            version: "1.0.0"
        };

        successResponse(ctx, data, 'Welcome to KOA Rest', 200);
    } catch (err: any) {
        errorResponse(ctx, null, err.message, 400);
    }
}