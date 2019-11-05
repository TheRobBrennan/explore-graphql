// Load our environment variables defined in back-end/javascript/apollo-server/apollo-tutorial/.env
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Apollo server
const { ApolloServer } = require("apollo-server");
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

// Start our server
const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});