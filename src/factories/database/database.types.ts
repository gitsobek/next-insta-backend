import { DatabaseConfig } from "../../interfaces/database";

export interface Database<T> {
  readonly mapper: T;
  configure: (config: DatabaseConfig) => T
  connect: () => Promise<void>;
}
