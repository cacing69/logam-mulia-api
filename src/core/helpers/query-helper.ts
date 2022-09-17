import { FindManyOptions, LessThan, Like } from 'typeorm';
import { CursorDto } from '../dtos/cursor.dto';
import { PaginateDto } from '../dtos/paginate.dto';

type CursorOption = {
  where?: any;
};

type PaginateOption = {
  where?: any;
};

export const cursorBuilder = (
  cursorDto: CursorDto,
  cursorOtions?: CursorOption,
) => {
  let where = {};
  if (cursorDto.lastId) {
    where = {
      id: LessThan(cursorDto.lastId),
    };
  }

  if (cursorDto?.filter) {
    Object.entries(cursorDto?.filter)?.forEach(([key, value]) => {
      where[key] = Like(`%${value}%`);
    });
  }

  const options: FindManyOptions = {
    take: cursorDto.limit,
    where,
    order: {
      id: 'DESC',
    },
  };

  return options;
};

export const paginateBuilder = (
  paginateDto: PaginateDto,
  paginateOption?: PaginateOption,
) => {
  // let where = {};
  // if (cursorDto.lastId) {
  //   where = {
  //     id: LessThan(decodeId(cursorDto.lastId)),
  //   };
  // }

  // if (cursorDto?.filter) {
  //   Object.entries(cursorDto?.filter)?.forEach(([key, value]) => {
  //     where[key] = Like(`%${value}%`);
  //   });
  // }

  const options: FindManyOptions = {
    take: paginateDto.limit,
    // where,
    order: {
      createdAt: 'DESC',
    },
    // take: paginateDto.limit,
    skip: (paginateDto.page - 1) * paginateDto.limit,
  };

  return options;
};
