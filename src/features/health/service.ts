export const healthService = {
	check: () => {
		return Response.json({
			status: 'healthy',
			message: 'Welcome to Logam Mulia API',
		});
	},
};
