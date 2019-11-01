// Load our environment variables defined in back-end/javascript/apollo-server/apollo-tutorial/.env
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');
const isEmail = require('isemail');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

// DEMO: Apollo Graph Manager
const internalEngineDemo = require('./engine-demo');

// Set up our database
const store = createStore();

const server = new ApolloServer({
  /**
   * The context function on your ApolloServer instance is called with the request object each time a GraphQL operation hits your API. Use this request object to read the authorization headers.
   */
  context: async ({ req }) => {
    // simple auth check on every request
    const auth = req.headers && req.headers.authorization || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');
    if (!isEmail.validate(email)) return { user: null };

    // Authenticate the user against our database
    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = users && users[0] || null;

    /**
     * Once the user is authenticated, attach the user to the object returned from the context function. This allows us to read the user's information from within our data sources and resolvers, so we can authorize whether they can access the data.
     */
    return { user: { ...user.dataValues } };
  },

  // Our GraphQL schema
  typeDefs,

  // Apollo Server will automatically add the launchAPI and userAPI to our resolvers' context so we can easily call them.
  resolvers,

  // Add instantiated data sources to the dataSources property for our server
  dataSources: () => ({
    // Use the Space-X REST API
    launchAPI: new LaunchAPI(),

    /*
      Pass in our database to the UserAPI data source

      IMPORTANT: If you use this.context in your datasource, it's critical to create a new instance in the dataSources function and to not share a single instance. Otherwise, initialize may be called during the execution of asynchronous code for a specific user, and replace the  this.context by the context of another user.
    */
    userAPI: new UserAPI({ store })

  }),

  engine: {
    apiKey: process.env.ENGINE_API_KEY,
    ...internalEngineDemo,
  },

});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});