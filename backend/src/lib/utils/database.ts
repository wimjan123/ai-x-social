import { PaginationParams } from '@/lib/types';

export const calculatePagination = (params: PaginationParams) => {
  const skip = (params.page - 1) * params.limit;
  const take = params.limit;

  return {
    skip,
    take,
    orderBy: params.sortBy
      ? {
          [params.sortBy]: params.sortOrder || 'desc',
        }
      : undefined,
  };
};

export const formatPaginationResponse = (
  totalCount: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(totalCount / limit);

  return {
    page,
    limit,
    total: totalCount,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};