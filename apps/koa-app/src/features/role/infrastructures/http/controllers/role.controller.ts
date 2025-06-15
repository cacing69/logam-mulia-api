import { Context } from 'koa';
import { successResponse, errorResponse } from '@shared/utils/response.util';

export async function handlePaginateRole(ctx: Context) {
    try {
        successResponse(ctx, null, 'List ', 200);
    } catch (err: any) {
        errorResponse(ctx, null, err.message, 400);
    }
}

export async function handleGetRoleById(ctx: Context) {
    const ulid = ctx.params.id;

    if (!ulid) {
        return errorResponse(ctx, null, 'Empty params ID', 400);
    }

    try {
        successResponse(ctx, null, '', 200);
    } catch (err: any) {
        errorResponse(ctx, null, err.message, 400);
    }
}

export async function handleUpdateRoleById(ctx: Context) {
    const ulid = ctx.params.id;

    if (!ulid) {
        return errorResponse(ctx, null, 'Empty params ID', 400);
    }

    try {
        successResponse(ctx, null, '', 200);
    } catch (err: any) {
        errorResponse(ctx, null, err.message, 400);
    }
}

export async function handleDeleteRoleById(ctx: Context) {
    const ulid = ctx.params.id;

    if (!ulid) {
        return errorResponse(ctx, null, 'Empty params ID', 400);
    }

    try {
        successResponse(ctx, null, '', 200);
    } catch (err: any) {
        errorResponse(ctx, null, err.message, 400);
    }
}
