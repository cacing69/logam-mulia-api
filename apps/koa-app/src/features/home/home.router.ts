import Router from 'koa-router';
import { handleHome } from './home.controller';

const userRouter = new Router({ prefix: '/' });

/**
 * @openapi
 * /:
 *   get:
 *     summary: Home
 *     security:
 *     tags:
 *       - Home
 *     responses:
 *       200:
 *         description: Created
 */
userRouter.get('/', handleHome);