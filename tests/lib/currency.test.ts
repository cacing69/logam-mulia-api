import { describe, it, expect } from 'vitest';
import { parseCurrency } from '../../src/lib/utils/currency';

describe('parseCurrency', () => {
	it('should parse Indonesian currency format with dots', () => {
		expect(parseCurrency('Rp2.737.000')).toBe(2737000);
		expect(parseCurrency('Rp1.500.000')).toBe(1500000);
		expect(parseCurrency('Rp10.000')).toBe(10000);
	});

	it('should parse IDR format with comma thousands and trailing dash', () => {
		expect(parseCurrency('IDR 2,566,000,-')).toBe(2566000);
	});

	it('should parse currency with commas as decimal separator', () => {
		expect(parseCurrency('Rp2.737,50')).toBe(2737.5);
		expect(parseCurrency('1.500,25')).toBe(1500.25);
	});

	it('should handle currency without prefix', () => {
		expect(parseCurrency('2.737.000')).toBe(2737000);
		expect(parseCurrency('1.500.000')).toBe(1500000);
	});

	it('should return 0 for invalid input', () => {
		expect(parseCurrency('')).toBe(0);
		expect(parseCurrency('invalid')).toBe(0);
		expect(parseCurrency('Rp')).toBe(0);
	});

	it('should handle numbers without formatting', () => {
		expect(parseCurrency('2737000')).toBe(2737000);
		expect(parseCurrency('1500000')).toBe(1500000);
	});

	it('should handle Indonesian decimal format', () => {
		expect(parseCurrency('1.500.000,00')).toBe(1500000);
		expect(parseCurrency('2.737.500,50')).toBe(2737500.5);
	});
});
