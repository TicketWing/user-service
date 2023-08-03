const config = {
  development: {
    client: "mysql2",
    version: "8.0.33",
    connection: {
      host: "user-database",
      port: 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "app/migrations",
    },
  },
};

export default config;
