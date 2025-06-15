import Router from 'koa-router';
import { handleAuthToken, handleAuthMe, handleAuthRefresh, handleCheckParams } from './controllers/auth.controller';
import { auth } from '@shared/middlewares/auth.middleware';
import { authTokenPayload } from '@features/auth/application/payloads/auth-token.payload';
import { validateRequestBody } from '@shared/middlewares/validate-request-body.middleware';

const authRouter = new Router({ prefix: '/auth' });

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Check currrent user
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Authentication
 *     responses:
 *      200:
 *          description: User profile
 *      401:
 *          description: Unauthorized
 */
authRouter.get('/me', auth, handleAuthMe);

/**
 * @openapi
 * /auth/token:
 *   post:
 *     summary: Login user and generate JWT token
 *     security: []
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/AuthTokenPayload'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/requestBodies/AuthTokenPayload'
 *     responses:
 *       200:
 *         description: Success login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/AuthTokenResponse'
 */
authRouter.post('/token', validateRequestBody(authTokenPayload), handleAuthToken);


/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     security: []
 *     tags:
 *      - Authentication
 *     summary: Generate new JWT token
 */
authRouter.post('/refresh', auth, handleAuthRefresh);

/**
 * @openapi
 * /auth/check/{flag}:
 *   get:
 *     summary: Check flag user for testing purpose only
 *     security: []
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: flag
 *         schema:
 *           type: string
 *         required: true
 *         description: String flag check
 *     responses:
 *      200:
 *          description: User profile
 */
authRouter.get('/check/:flag', handleCheckParams);

export default authRouter;