// Purpose: Define the environment configuration for the application.
export const EnvConfig = () => ({
  environment: process.env.NODE_ENV || 'dev',
  port: +process.env.PORT || 3000,
  database: {
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_HOST_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    db: process.env.POSTGRES_DB,
  },
  globalPrefix: process.env.GLOBAL_PREFIX || 'api',
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
});
