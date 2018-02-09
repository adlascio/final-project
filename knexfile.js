module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'ten_out_of_tenant',
      user: 'development',
      password: 'development'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds'
    }
  },
  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};