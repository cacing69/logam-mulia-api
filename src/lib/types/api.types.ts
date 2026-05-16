export interface ApiResponse<T = unknown> {
	success: boolean;
	data?: T | T[];
	error?: string;
	timestamp: string;
	source: string;
	currency?: string;
	count?: number;
	inactive?: boolean;
	url?: string;
	displayName?: string;
	logo?: string;
	urlHomepage?: string;
}

/** @deprecated Use ApiResponse */
export type ScrapingResult<T = unknown> = ApiResponse<T>;
