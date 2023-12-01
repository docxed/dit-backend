const knex = require('knex')

const knexConfig = {
  client: 'pg',
  connection: {
    connectionString: process.env.POSTGRES_URL,
    ssl: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  },
}

const db = knex(knexConfig)
module.exports = db
