import { userCreatePayload } from '@features/user/application/payloads/user-create.payload';
import Router from 'koa-router';
import { handleCreateUser, handlePaginateUser } from '@features/user/infrastructures/http/controllers/user.controller';
import { auth } from '@shared/middlewares/auth.middleware';
import { paginateQuery } from '@shared/payload/query/paginate.query';
import { userFilterQuery } from '@shared/payload/query/user-filter.query';
import { validateQueryParams } from '@shared/middlewares/validate-query-params.middleware';
import { validateRequestBody } from '@shared/middlewares/validate-request-body.middleware';

const userRouter = new Router({ prefix: '/user' });

/**
 * @openapi
 * /user:
 *   get:
 *     summary: Paginate User
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Created
 */
userRouter.get('/', auth, validateQueryParams(paginateQuery), validateQueryParams(userFilterQuery), handlePaginateUser);

/**
 * @openapi
 * /user:
 *   post:
 *     summary: Create new User
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/UserCreatePayload'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/requestBodies/UserCreatePayload'
 *     responses:
 *       201:
 *         description: Created
 */
userRouter.post('/', auth, validateRequestBody(userCreatePayload), handleCreateUser);

export default userRouter;

// permission
// 1. create-user

// role
// 1. admin

// role-permission
// id, role_id, permission_id
// 1, 1, 1
