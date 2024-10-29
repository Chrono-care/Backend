import {
  IsNull,
  Not,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  ILike,
  In,
} from 'typeorm';

import {
  IFiltering,
  FilterRule,
} from '../decorators/filteringParams.decorator';
import { Sorting } from '../decorators/sortingParams.decorator';

export const getOrder = (sort: Sorting): object =>
  sort ? { [sort.property]: sort.direction } : {};

export const getWhere = (filters: IFiltering[]): object => {
  if (!filters || filters.length === 0) return {};

  const whereClause = {};

  filters.forEach((filter) => {
    let condition;

    switch (filter.rule) {
      case FilterRule.IS_NULL:
        condition = IsNull();
        break;
      case FilterRule.IS_NOT_NULL:
        condition = Not(IsNull());
        break;
      case FilterRule.EQUALS:
        condition = filter.value;
        break;
      case FilterRule.NOT_EQUALS:
        condition = Not(filter.value);
        break;
      case FilterRule.GREATER_THAN:
        condition = MoreThan(filter.value);
        break;
      case FilterRule.GREATER_THAN_OR_EQUALS:
        condition = MoreThanOrEqual(filter.value);
        break;
      case FilterRule.LESS_THAN:
        condition = LessThan(filter.value);
        break;
      case FilterRule.LESS_THAN_OR_EQUALS:
        condition = LessThanOrEqual(filter.value);
        break;
      case FilterRule.LIKE:
        condition = ILike(`%${filter.value}%`);
        break;
      case FilterRule.NOT_LIKE:
        condition = Not(ILike(`%${filter.value}%`));
        break;
      case FilterRule.IN:
        condition = In(filter.value.split(','));
        break;
      case FilterRule.NOT_IN:
        condition = Not(In(filter.value.split(',')));
        break;
      default:
        // Skip unknown filter rules
        return;
    }

    // If the property already exists in the where clause, we need to handle it as an AND condition
    if (whereClause.hasOwnProperty(filter.property)) {
      whereClause[filter.property] = Array.isArray(whereClause[filter.property])
        ? [...whereClause[filter.property], condition]
        : [whereClause[filter.property], condition];
    } else {
      whereClause[filter.property] = condition;
    }
  });

  return whereClause;
};
