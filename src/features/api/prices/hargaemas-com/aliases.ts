import { hargaemasComConfig } from './config';

const CANON = hargaemasComConfig.name;

/**
 * Copas alamat (domain, www, http(s), kutip penutup, slash akhir) pada segmen path `/api/prices/&lt;segmen&gt;`.
 * @returns nama sumber kanonik (`hargaemas.com`) jika cocok, selain itu `null`.
 */
export function resolveHargaemasComSourceName(segment: string): string | null {
	let s = decodeURIComponent(segment).trim();
	s = s.replace(/'+$/u, '');
	s = s.replace(/\/+$/u, '');
	if (!/^(?:https?:\/\/)?(?:www\.)?hargaemas\.com$/iu.test(s)) {
		return null;
	}
	return CANON;
}
