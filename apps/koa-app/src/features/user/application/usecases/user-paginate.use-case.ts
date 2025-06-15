import { PaginateQuery } from '@shared/payload/query/paginate.query';
import { UserFilterQuery } from '@shared/payload/query/user-filter.query';
import { paginateUser } from '@features/user/infrastructures/repositories/user.repository';


export const userPaginateUseCase = async (paginate: PaginateQuery, filter?: UserFilterQuery) => {
    return paginateUser(paginate, filter);
}