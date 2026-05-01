import { Hono } from 'hono';

const app = new Hono();

type RootResponse = {
	message: string;
	status: 'running';
	data: {
		contributors: string[];
		availableSites: Array<{
			sites: string;
			path: string;
		}>;
	};
};

app.get('/', (c) => {
	const response: RootResponse = {
		message: 'Welcome to Logam Mulia API',
		status: 'running',
		data: {
			contributors: ['cacing69', 'dayatnhbtc'],
			availableSites: [{
				sites: 'https://anekalogam.co.id',
				path: 'api/prices/anekalogam',
			}],
		},
	};

	return c.json(response);
});

export default app;
