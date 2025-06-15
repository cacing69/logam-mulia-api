import { findUserByEmail, verifyPassword } from '@features/user/infrastructures/repositories/user.repository';
import { generateToken } from '@shared/utils/jwt.util';
import { AuthTokenPayload } from '@features/auth/application/payloads/auth-token.payload';

export type AuthLoginResponse = {
    user: any,
    token: string;
};

export const authTokenUseCase = async (
    input: AuthTokenPayload
): Promise<AuthLoginResponse> => {
    // Step 1: Cari user berdasarkan email
    const user = await findUserByEmail(input.email);

    if (!user) {
        throw new Error('Email or password is invalid');
    }

    // Step 2: Verifikasi password
    const isValidPassword = await verifyPassword(input.password, user.password);

    if (!isValidPassword) {
        throw new Error('Email or password is invalid');
    }

    const payload = {
        id: user.id,
        email: user.email
    };

    const token = generateToken(payload);

    // Step 3: Return user tanpa password
    return {
        user: {
            id: user.id,
            firstName: user.firstName,
            email: user.email,
        },
        token
    };
};