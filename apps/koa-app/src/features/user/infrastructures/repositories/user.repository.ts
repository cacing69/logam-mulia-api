import { PrismaClient } from '@shared/prisma/client';
import bcrypt from 'bcryptjs';
import { PaginateQuery } from '@shared/payload/query/paginate.query';
import { UserFilterQuery } from '@shared/payload/query/user-filter.query';
import { UserCreatePayload } from '@features/user/application/payloads/user-create.payload';
import { UserUpdatePayload } from '@features/user/application/payloads/user-update.payload';

const isProduction = process.env.NODE_ENV === 'production';

const prisma = new PrismaClient({
    log: isProduction
        ? []
        : [{ level: 'query', emit: 'event' }]
});

if (!isProduction) {
    prisma.$on('query', (e) => {
        console.log(`\n[PRISMA QUERY LOG]`);
        console.log('Query\t\t:', e.query);
        console.log('Params\t\t:', e.params);
        console.log('Duration\t:', e.duration);
        console.log('-------------------------');
    });
}

export const paginateUser = async (paginate: PaginateQuery, filter?: UserFilterQuery) => {

    const { limit, cursor, search } = paginate;

    const where: any = {};

    // Search Global Query
    if (search && search?.length > 0) {
        where.OR = [
            { firstName: { contains: search as string, mode: 'insensitive' } },
            { email: { contains: search as string, mode: 'insensitive' } },
        ]
    }

    // FilterQuery
    if (filter?.firstName) {
        where.firstName = { contains: filter.firstName, mode: "insensitive" };
    }

    if (cursor) {
        where.id = {
            gt: cursor
        }
    }

    const results = await prisma.user.findMany({
        where,
        take: parseInt(`${limit}`),
        orderBy: { id: `asc` }
    });

    // Hide some field before send it as response
    const formatted = results.map((row) => ({
        id: row.id,
        firstName: row.firstName,
        email: row.email,
        createdAt: row.createdAt,
    }))

    return {
        paginate: formatted,
        meta: {
            nextCursor: results[results?.length - 1]?.id,
            limit: parseInt(`${paginate.limit}`),
            useOffset: false,
        }
    }
}

export const findUserById = (id: string) => {
    return prisma.user.findUnique({ where: { id } });
}

export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({ where: { email } });
}

export const createUser = async (data: UserCreatePayload) => {
    const hashedPassword = await hashPassword(data.password);
    return prisma.user.create({
        data: {
            ...data,
            password: hashedPassword
        }
    });
};

export const updateUser = async (id: string, data: UserUpdatePayload) => {
    const updatedData: any = { ...data, updatedAt: new Date() };

    if (data.password) {
        const hashedPassword = await hashPassword(data.password);
        updatedData.password = hashedPassword;
    }

    return prisma.user.update({
        where: { id },
        data: updatedData,
    });
}

export const deleteUser = (id: string) => {
    return prisma.user.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    });
}

// Verifikasi password
export const verifyPassword = async (
    inputPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(inputPassword, hashedPassword);
};

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
}