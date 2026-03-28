import { NotFoundException } from '@nestjs/common';
import { Pagination } from '../interfaces/pagination.interface';

export const paginationCalculation = (
  count: number,
  take: number,
  skip: number,
): Pagination => {
  const totalPages = Math.ceil(count / take);
  const currentPage = Math.floor(skip / take) + 1;

  if (currentPage > totalPages) throw new NotFoundException('Page not Found');

  return {
    prev: !currentPage,
    next: totalPages > currentPage,
    totalPages,
    currentPage,
    count,
  };
};
