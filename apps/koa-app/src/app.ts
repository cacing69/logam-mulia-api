import { errorHandlerMiddleware } from "./shared/middlewares/error-handler.middleware";
import bodyParser from "koa-bodyparser";
import Koa from "koa";
import koaCors from 'koa2-cors';
import koaHelmet from 'koa-helmet';
import path from 'path';
import serve from 'koa-static';
import swaggerMiddleware from "./shared/middlewares/swagger.middleware";

import authRouter from "@features/auth/infrastructures/http/auth.router";
import testRouter from '@features/test/infrastructures/http/test.router';
import userRouter from "@features/user/infrastructures/http/user.router";

const app = new Koa();

app.use(errorHandlerMiddleware);
app.use(bodyParser());


app.use(koaCors({
    origin: '*',
    allowMethods: ['HEAD', 'GET', 'PATCH', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
}));
app.use(swaggerMiddleware);

app.use(serve(path.join(__dirname, 'public')));
app.use(serve(path.join(__dirname, 'uploadsyarn')));


app.use(koaHelmet());

// Menggunakan koa2-winston untuk logging
// app.use(koa2Winston({
//     winstonInstance: logger, // Instance winston yang sudah dikonfigurasi
// }));

app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(authRouter.routes()).use(authRouter.allowedMethods());
app.use(testRouter.routes()).use(testRouter.allowedMethods());

// Set ke process.env
// process.env.DATABASE_URL = DATABASE_URL;

export default app;
