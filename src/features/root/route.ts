import { Hono } from 'hono';

const app = new Hono();

type RootResponse = {
	message: string;
	status: 'running';
	data: {
		contributors: string[];

	};
};

app.get('/', (c) => {
	const response: RootResponse = {
		message: 'Welcome to Logam Mulia API',
		status: 'running',
		data: {
			contributors: ['cacing69', 'dayatnhbtc'],

		},
	};

	return c.json(response);
});

export default app;
