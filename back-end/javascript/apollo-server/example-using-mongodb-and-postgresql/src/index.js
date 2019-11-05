// Load our environment variables defined in back-end/javascript/apollo-server/apollo-tutorial/.env
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");
const { ObjectID } = require("mongodb");
const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
  }
});

const mongoDB = {
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  database: process.env.MONGO_DATABASE,
}
const mongoConnectionString = `mongodb://${mongoDB.host}:${mongoDB.port}/${mongoDB.database}`;
mongoose.connect(mongoConnectionString, { useNewUrlParser: true });

const User = mongoose.model("user", { name: String, bookIds: [Number] });

const typeDefs = gql`
  type Book {
    id: Int!
    title: String!
    author: User
  }
  type User {
    id: ID!
    name: String!
    books: [Book!]!
  }
  type Query {
    books: [Book]
    users: [User]
  }
  type Mutation {
    createUser(name: String!): User
    createBook(title: String!, author: String!): Book
  }
`;

const resolvers = {
  Mutation: {
    createUser: async (_, { name }) => {
      const user = new User({ name, bookIds: [] });
      await user.save();
      return user;
    },
    createBook: async (_, { title, author }) => {
      const [book] = await knex("book")
        .returning("*")
        .insert({ title, author });

      await User.updateOne(
        { _id: new ObjectID(author) },
        {
          $push: { bookIds: book.id }
        }
      );

      return book;
    }
  },
  Query: {
    books: () => knex("book").select("*"),
    users: () => User.find()
  },
  Book: {
    author: root => {
      return User.findOne({ bookIds: root.id });
    }
  },
  User: {
    books: root => {
      return knex("book")
        .whereIn("id", root.bookIds)
        .select("*");
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});