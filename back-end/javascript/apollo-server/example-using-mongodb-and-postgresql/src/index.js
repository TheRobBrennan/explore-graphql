// Load our environment variables defined in back-end/javascript/apollo-server/apollo-tutorial/.env
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Apollo server
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const apolloEngine = require('./apollo/engine-demo');
// If you are using the Apollo Graph Manager, be sure to define ENGINE_API_KEY in your .env file
const engine = (process.env.ENGINE_API_KEY) ? {...apolloEngine, apiKey: process.env.ENGINE_API_KEY} : {}

// Start our server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  engine,
});
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
