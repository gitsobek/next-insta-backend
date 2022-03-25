declare module '@next-insta/dotenv-typings' {
  interface IDotenvConfig {
    path?: string;
  }

  export interface IDotenv {
    config: (arg?: IDotenvConfig) => void;
  }
}
