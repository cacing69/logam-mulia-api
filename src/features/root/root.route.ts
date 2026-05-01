import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
	return c.json({
		message: 'Welcome to Logam Mulia API',
		status: 'running',
	});
});

export default app;
