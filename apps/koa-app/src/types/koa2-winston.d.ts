declare module 'koa2-winston' {
    import { Middleware } from 'koa';
    import { Logger } from 'winston';

    interface Koa2WinstonOptions {
        winstonInstance: Logger;
    }

    function koa2Winston(options: Koa2WinstonOptions): Middleware;

    export = koa2Winston;
}