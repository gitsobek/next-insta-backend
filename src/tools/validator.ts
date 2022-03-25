import { celebrator, Celebrator2 } from 'celebrate';

export function createValidator(): Celebrator2 {
  return celebrator({ reqContext: true }, { abortEarly: false });
}
