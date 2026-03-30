import { FindOptionsWhere } from "typeorm";

export type WhereTypeORM<T> = FindOptionsWhere<T>[] | FindOptionsWhere<T>;