import { Context, Next } from 'koa';

export const roleTable = {
    '01JT4RNCD984PZ9KFZEAHTRBDZ': 'developer'
};

export const permissionsTable = {
    'developer': [
        'create-user',
        'update-user',
        'delete-user'
    ],
    'admin': [
        'create-user',
    ]
};

export const userPermissionsTable = {
    '01JT4RNCD984PZ9KFZEAHTRBDZ': [
        'create-user-test',
        'delete-user-test',
    ]
};

export const hasRole = (roles: string[]) => {
    return async (ctx: Context, next: Next) => {

        try {
            const user: { id: string } = ctx.state.user;
            const roleUser = [roleTable[user.id as keyof typeof roleTable]];
            const availableRoles = new Set(roleUser);

            if (!user || !roles.some(item => availableRoles.has(item))) {
                ctx.status = 403;
                ctx.body = {
                    error: 'Forbidden',
                    details: `Missing required role: ${roles}`
                };

                return;
            }

            await next();
        } catch (err: any) {
            console.log(err);
            await next();
        }
    };
}

export const hasPermission = (permissions: string[]) => {
    return async (ctx: Context, next: Next) => {

        try {
            const user: { id: string } = ctx.state.user;

            const role = roleTable[user.id as keyof typeof roleTable] as keyof typeof permissionsTable;

            const rolePermission = permissionsTable[role];
            const userPermission = userPermissionsTable[user.id as keyof typeof userPermissionsTable];

            const availablePermissions = new Set([...rolePermission, ...userPermission]);

            if (!availablePermissions || !permissions?.some(item => availablePermissions.has(item))) {
                ctx.status = 403;
                ctx.body = {
                    error: 'Forbidden',
                    details: [`Missing required permissions: ${permissions}`]
                };

                return;
            }

            await next();
        } catch (err: any) {
            console.log(err);
            await next();
        }
    };
}