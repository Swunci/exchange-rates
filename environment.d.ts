declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "test" | "production";
      MONGODB_URL: string;
    }
  }
}

export {};
