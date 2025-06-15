import { isValidEmail } from '../../src/shared/utils/string.util';

describe('String Util', () => {
    it('Should return true : valid email', () => {
        expect(isValidEmail('ibnuul@example.com')).toBe(true);
    });

    it('Should return true : invalid email', () => {
        expect(isValidEmail('invalid-email')).toBe(false);
        expect(isValidEmail('no-domain@')).toBe(false);
        expect(isValidEmail('no-at-sign.com')).toBe(false);
    });
});