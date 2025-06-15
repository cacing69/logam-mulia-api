import { Logger } from 'winston';

declare module 'koa' {
    interface BaseContext {
        logger: Logger;
    }
}