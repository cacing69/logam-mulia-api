export const successResponse = (ctx: any, data: any, message = 'OK', status = 200) => {
    ctx.status = status;
    ctx.body = {
        message,
        data
    };
};

export const successPaginateResponse = (ctx: any, data: any, meta: any, message = 'OK', status = 200) => {
    ctx.status = status;
    ctx.body = {
        message,
        data,
        meta,
    };
};

export const errorResponse = (ctx: any, details: any, error = 'Internal Server Error', status = 500) => {
    ctx.status = status;
    ctx.body = {
        error,
        details
    };
};