declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET_KEY: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      REDIS_USERNAME: string;
      REDIS_PASSWORD: string;
      ACCESS_SECRET: string;
      REFRESH_SECRET: string;
      ACCESS_EXPIRATION: string;
      REFRESF_EXPIRATION: string;
    }
  }
}

export {};
