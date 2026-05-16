export interface RawValue {
	__raw: string | number;
}

export function raw(value: string | number | null): RawValue {
	return { __raw: value ?? '' };
}

export type TransformFn = (data: Record<string, string>) => Record<string, string>;
/** @deprecated Use TransformFn */
export type ScrapingPostProcess = TransformFn;

export interface ScraperItem<T extends string = string> {
	url?: string;
	selector: Record<T, string | RawValue>;
	postProcess?: TransformFn;
	lineKey?: string;
}
/** @deprecated Use ScraperItem */
export type ItemDefinition<T extends string = string> = ScraperItem<T>;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
/** @deprecated Use HttpMethod */
export type AxiosMethod = HttpMethod;

export interface JsonFieldMapping {
	buybackPrice?: string;
	sellPrice?: string;
	weight?: number;
	weightUnit?: string;
	[key: string]: string | number | undefined;
}
/** @deprecated Use JsonFieldMapping */
export type AxiosSelectorDefinition = JsonFieldMapping;

export interface JsonApiItem {
	url?: string;
	selector: JsonFieldMapping;
}
/** @deprecated Use JsonApiItem */
export type AxiosItemDefinition = JsonApiItem;

export interface FetchOptions {
	timeout?: number;
	headers?: Record<string, string>;
	retries?: number;
}
/** @deprecated Use FetchOptions */
export type ScrapingOptions = FetchOptions;
