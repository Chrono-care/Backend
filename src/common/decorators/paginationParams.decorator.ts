import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface Pagination {
  page: number;
  limit: number;
  size: number;
  offset: number;
}

export const PaginationParams = createParamDecorator(
  (_, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();
    let page = parseInt(req.query.page as string);
    let size = parseInt(req.query.size as string);

    if (!page) {
      page = 0;
    }
    if (!size) {
      size = 15;
    }
    // check if page and size are valid
    if (isNaN(page) || page < 0 || isNaN(size) || size < 0) {
      throw new BadRequestException('Paramètre "pagination" invalide');
    }
    // do not allow to fetch large slices of the dataset
    if (size > 100) {
      throw new BadRequestException(
        'Paramètre "pagination" invalide : la taille maximale autorisée est de 100',
      );
    }

    // calculate pagination parameters
    const limit = size;
    const offset = page * limit;
    return { page, limit, size, offset };
  },
);
