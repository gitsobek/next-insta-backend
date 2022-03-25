import { AwilixContainer } from 'awilix';

declare global {
  namespace NodeJS {
    interface Global {
      container: AwilixContainer;
    }
  }

  var container: AwilixContainer;
}
