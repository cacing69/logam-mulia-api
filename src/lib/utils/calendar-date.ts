const DATE_ONLY_LEN = 10;

const JAKARTA_TZ = 'Asia/Jakarta';

/** Tanggal kalender UTC `YYYY-MM-DD` (legacy / perbandingan). */
export function utcCalendarDateString(d = new Date()): string {
	return d.toISOString().slice(0, DATE_ONLY_LEN);
}

/**
 * Tanggal kalender bisnis **Asia/Jakarta** (`YYYY-MM-DD`) untuk bucket `recorded_date` di DB.
 */
export function jakartaCalendarDateString(d = new Date()): string {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: JAKARTA_TZ,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(d);
}

/** Ambil `YYYY-MM-DD` dari awal string ISO (`created_at`). */
export function dateOnlyFromIsoTimestamp(iso: string): string {
	if (iso.length < DATE_ONLY_LEN) {
		return iso;
	}
	return iso.slice(0, DATE_ONLY_LEN);
}
