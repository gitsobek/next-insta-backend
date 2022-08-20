import type { Period } from '../utils/types';

export interface DatabaseConfig {
  client: 'pg';
  connection: string;
}

export type DatabasePeriod = `${number} ${Period}`;
