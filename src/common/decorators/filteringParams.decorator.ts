import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface IFiltering {
  property: string;
  rule: string;
  value: string;
}

export enum FilterRule {
  EQUALS = 'eq',
  NOT_EQUALS = 'neq',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  LIKE = 'like',
  NOT_LIKE = 'nlike',
  IN = 'in',
  NOT_IN = 'nin',
  IS_NULL = 'isnull',
  IS_NOT_NULL = 'isnotnull',
}

const validateFilterConditions = (filterConditions: string[]): void => {
  if (filterConditions.length % 3 !== 0 && filterConditions.length % 2 !== 0) {
    throw new BadRequestException('Invalid filter format');
  }
};

const validateProperty = (property: string, data: string[]): void => {
  if (!data.includes(property)) {
    throw new BadRequestException(`Invalid filter property: ${property}`);
  }
};

const validateRule = (rule: string): void => {
  if (!Object.values(FilterRule).includes(rule as FilterRule)) {
    throw new BadRequestException(`Invalid filter rule: ${rule}`);
  }
};

const processFilterCondition = (
  property: string,
  rule: string,
  value: string,
  data: string[],
): IFiltering => {
  validateProperty(property, data);
  validateRule(rule);

  if (rule === FilterRule.IS_NULL || rule === FilterRule.IS_NOT_NULL) {
    return { property, rule, value: null };
  }

  if (!value) {
    throw new BadRequestException(`Missing value for property: ${property}`);
  }

  return { property, rule, value };
};

export const FilteringParams = createParamDecorator(
  (data: string[], ctx: ExecutionContext): IFiltering[] => {
    const req: Request = ctx.switchToHttp().getRequest();
    const filter = req.query.filter as string;
    if (!filter) return [];

    if (typeof data !== 'object' || !Array.isArray(data)) {
      throw new BadRequestException('Invalid data parameter');
    }

    const filterConditions = filter.split(':');
    validateFilterConditions(filterConditions);

    const result: IFiltering[] = [];

    for (let i = 0; i < filterConditions.length; i += 3) {
      const property = filterConditions[i];
      const rule = filterConditions[i + 1];
      const value = filterConditions[i + 2];

      const filteringItem = processFilterCondition(property, rule, value, data);
      result.push(filteringItem);

      if (rule === FilterRule.IS_NULL || rule === FilterRule.IS_NOT_NULL) {
        i--; // Adjust index since we don't have a value for these rules
      }
    }

    return result;
  },
);
