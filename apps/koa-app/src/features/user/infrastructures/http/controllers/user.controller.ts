
import { Context } from 'koa';
import { successResponse, errorResponse, successPaginateResponse } from '@shared/utils/response.util';
import { UserCreatePayload } from '@features/user/application/payloads/user-create.payload';
import { PaginateQuery } from '@shared/payload/query/paginate.query';
import { UserFilterQuery } from '@shared/payload/query/user-filter.query';
import { userCreateUseCase } from '@features/user/application/usecases/user-create.use-case';
import { userPaginateUseCase } from '@features/user/application/usecases/user-paginate.use-case';

export const handlePaginateUser = async (ctx: Context) => {
    try {
        const { paginate, meta } = await userPaginateUseCase(
            ctx.request.query as unknown as PaginateQuery,
            ctx.request.query as unknown as UserFilterQuery,
        );

        // const meta = {
        //     nextCursor: paginate[paginate.length - 1].id
        // };

        successPaginateResponse(ctx, paginate, meta,'User data', 200);
    } catch (err: any) {
        errorResponse(ctx, null, err.message, 400);
    }
}

export const handleCreateUser = async (ctx: Context) => {
    try {
        const user = await userCreateUseCase(ctx.request.body as UserCreatePayload);
        successResponse(ctx, null, 'User created successfully', 201);
    } catch (err: any) {
        errorResponse(ctx, null, err.message, 400);
    }
}