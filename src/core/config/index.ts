import { Environments } from './types';

const config = {
  ENV: Environments.PRODUCTION,
  PORT: 8080,
  CONSOLE_LOG_ENABLED: true,
  db: {
    auth: {
      DB_TYPE: process.env.DB_TYPE || 'mysql',
      DB_HOST: process.env.DB_HOST || 'localhost',
      DB_USER_NAME: process.env.DB_USERNAME || 'root',
      DB_PASSWORD: process.env.DB_PASSWORD || 'anuj123',
      DB_NAME: process.env.DB_NAME || 'demoapp',
      DB_PORT: process.env.DB_PORT || '3306',
      JWT_SECRET: process.env.JWT_SECRET || 'secretKey',
    },
  },
};

export default config;
