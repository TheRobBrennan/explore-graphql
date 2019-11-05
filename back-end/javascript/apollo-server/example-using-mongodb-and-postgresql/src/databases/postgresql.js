const postgreSQL = {
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
}

module.exports = {
  postgreSQL: postgreSQL,
}
