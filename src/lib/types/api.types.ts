export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T | T[];
	error?: string;
	timestamp: string;
	source: string;
	currency?: string;
	count?: number;
	inactive?: boolean;
}

/** @deprecated Use ApiResponse */
export type ScrapingResult<T = unknown> = ApiResponse<T>;
