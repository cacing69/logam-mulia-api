import { createUser, findUserByEmail } from '@features/user/infrastructures/repositories/user.repository';
import { UserCreatePayload } from '../payloads/user-create.payload';

export const userCreateUseCase = async (user: UserCreatePayload) => {
    const existing = await findUserByEmail(user.email);

    if (existing) {
        throw new Error('Email already exists');
    }

    return createUser(user);
}