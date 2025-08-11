import type { Book } from "./book.type";

export type CartItem = {
  book: Book;
  quantity: number;
};