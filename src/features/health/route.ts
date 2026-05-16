import { Hono } from 'hono';
import { healthService } from './service';

const app = new Hono();

app.get('/', healthService.check);

export default app;
