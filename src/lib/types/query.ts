export interface Pagination {
  page?: number;

  limit?: number;

  sortBy?: string;

  order?: "ASC" | "DESC";
}

export interface AdvancedQueryParams extends Pagination {
  fields?: string | string[];

  query?: string;

  caseSensitive?: number;

  fromDate?: Date;

  toDate?: Date;

  startTime?: Date;

  endTime?: Date;

  dateFilterField?: string;

  status?: string | string[];

  role?: string | string[];

  ids?: string | string[];

  userId?: string;
}

export interface QueryParamsWithCursor extends AdvancedQueryParams {
  cursor?: string;
}

export interface QueryParamsWithOffset extends AdvancedQueryParams {
  offset?: number;
}
