export interface ApiErrorResponse {
	success: false;
	error: string;
	timestamp: string;
}

export function createErrorResponse(error: string): ApiErrorResponse {
	return {
		success: false,
		error,
		timestamp: new Date().toISOString(),
	};
}
