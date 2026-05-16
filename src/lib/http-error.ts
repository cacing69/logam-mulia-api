export interface ErrorResponse {
	success: false;
	error: string;
	timestamp: string;
}

/** @deprecated Use ErrorResponse */ export type ApiErrorResponse = ErrorResponse;

export function createErrorResponse(error: string): ErrorResponse {
	return {
		success: false,
		error,
		timestamp: new Date().toISOString(),
	};
}
