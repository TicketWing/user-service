module.exports = {
  development: {
    client: "mysql2",
    version: "8.0.33",
    connection: {
      host: "ticketwing-database",
      port: 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./src/migrations",
    },
  },
};