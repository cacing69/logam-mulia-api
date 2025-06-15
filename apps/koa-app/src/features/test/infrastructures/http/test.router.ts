import Router from "koa-router";
import { handlePublic } from "@features/test/infrastructures/http/controllers/test.controller";

const testRouter = new Router({ prefix: "/test" });

/**
 * @openapi
 * /test/public:
 *   get:
 *     security: []
 *     summary: Testing public endpoint
 *     tags:
 *       - Test
 *     responses:
 *      200:
 *          description: Test
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/responses/TestPublicResponse'
 *      401:
 *          description: Unauthorized
 */
testRouter.get("/public", handlePublic);

export default testRouter;
