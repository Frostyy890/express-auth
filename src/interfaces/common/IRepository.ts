export interface IRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T>;
  create(data: T): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<T>;
}
