import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface Sorting {
  property: string;
  direction: string;
}

export const SortingParams = createParamDecorator(
  (validParams, ctx: ExecutionContext): Sorting => {
    const req: Request = ctx.switchToHttp().getRequest();
    const sort = req.query.sort as string;
    if (!sort) return null;

    // check if the valid params sent is an array
    if (typeof validParams != 'object')
      throw new BadRequestException('Paramètre "sort" invalide');

    // check the format of the sort query param
    const sortPattern = /^([\w]+):(asc|desc)$/;
    if (!sort.match(sortPattern))
      throw new BadRequestException('Paramètre "sort" invalide');

    // extract the property name and direction and check if they are valid
    const [property, direction] = sort.split(':');
    if (!validParams.includes(property))
      throw new BadRequestException(
        `Propriété invalide dans le paramètre "sort": ${property}`,
      );

    return { property, direction };
  },
);
