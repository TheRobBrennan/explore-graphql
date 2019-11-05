// PostgreSQL
const { postgreSQL } = require('../databases/postgresql');
const { host, user, password, database } = postgreSQL;
const knex = require("knex")({
  client: "pg",
  connection: {
    host,
    user,
    password,
    database,
  }
});

// MongoDB
const { ObjectID } = require('mongodb');
const { connectionString } = require('../databases/mongodb');

// Mongoose
const mongoose = require('mongoose');
mongoose.connect(connectionString, { useNewUrlParser: true });

// Models
const User = mongoose.model('user', { name: String, bookIds: [Number] });

// GraphQL schema implementation
module.exports = {
  Mutation: {
    createUser: async (_, { name }) => {
      const user = new User({ name, bookIds: [] });
      await user.save();
      return user;
    },
    createBook: async (_, { title, author }) => {
      const [book] = await knex('book')
        .returning('*')
        .insert({ title, author });

      await User.updateOne(
        { _id: new ObjectID(author) },
        {
          $push: { bookIds: book.id },
        }
      );

      return book;
    },
  },
  Query: {
    books: () => knex('book').select('*'),
    users: () => User.find(),
  },
  Book: {
    author: root => {
      return User.findOne({ bookIds: root.id });
    },
  },
  User: {
    books: root => {
      return knex('book')
        .whereIn('id', root.bookIds)
        .select('*');
    },
  },
};
