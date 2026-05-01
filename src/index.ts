import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
	return c.json({
		message: 'Welcome to Logam Mulia API',
		status: 'running',
	});
});

app.get('/health', (c) => {
	return c.json({ status: 'healthy' , message: 'Welcome to Logam Mulia API',});
});

export default app;
