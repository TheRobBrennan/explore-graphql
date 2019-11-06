const { gql } = require('apollo-server');

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

module.exports = typeDefs
