const config = {
  development: {
    client: "mysql2",
    version: "8.0.33",
    connection: {
      host: "user-database",
      port: 3306,
      user: 'admin',
      password: 'Qwerty1234',
      database: 'user-service',
    },
    migrations: {
      directory: "migrations",
      loadExtensions: ['.js']
    },
  },
};

export default config;
