import type { Response } from "express";

export interface Pagination {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  limit: 10;
}

export interface ListResponse<TItem> {
  data: TItem[];
  pagination: Pagination;
}

export interface ItemResponse<TItem> {
  data: TItem;
}

export const sendItem = <TItem>(res: Response, statusCode: number, data: TItem): void => {
  res.status(statusCode).json({ data } satisfies ItemResponse<TItem>);
};

export const sendList = <TItem>(res: Response, data: TItem[], pagination: Pagination): void => {
  res.status(200).json({ data, pagination } satisfies ListResponse<TItem>);
};
