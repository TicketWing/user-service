declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET_KEY: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
    }
  }
}

export {};
