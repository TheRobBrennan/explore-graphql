const mongoDB = {
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  database: process.env.MONGO_DATABASE,
}

module.exports = {
  mongoDB: mongoDB,
  connectionString: `mongodb://${mongoDB.host}:${mongoDB.port}/${mongoDB.database}`,
}
