import { compareSync, hashSync } from 'bcrypt';
import type { CommonDependencies } from '../interfaces/app';

export class SecurityService {
  constructor(private dependencies: CommonDependencies) {}

  performHash(plainText: string): string {
    const { appConfig } = this.dependencies;

    return hashSync(plainText, appConfig.saltRounds);
  }

  compareWithHash(plainText: string, hashedText: string): boolean {
    return compareSync(plainText, hashedText);
  }
}
