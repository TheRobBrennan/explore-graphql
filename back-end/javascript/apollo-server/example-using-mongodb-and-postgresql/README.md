# Welcome

This is a lightweight example demonstrating how your GraphQL server may work with both a [MongoDB](https://www.mongodb.com) back-end and a [PostgreSQL](https://www.postgresql.org) back-end.

## GraphQL playground

### View users (stored in MongoDB)

```sh
# In the GraphQL playground
{
  users {
    id
    name
  }
}

# Output will be something like...
{
  "data": {
    "users": [
      {
        "id": "5dc1f60d89c31b003d109a1b",
        "name": "rob"
      }
    ]
  }
}
```

### Create a user (stored in MongoDB)

```sh
# In the GraphQL playground
mutation {
  createUser(name: "rob") {
    id
    name
  }
}

# Output will be something like...
{
  "data": {
    "createUser": {
      "id": "5dc1f60d89c31b003d109a1b",
      "name": "rob"
    }
  }
}
```

### Create a book using the ID of the newly created user (stored in PostgreSQL)

You'll need to make sure you have manually created a table in your locally running PostgreSQL database 🥰

```sh
# Create a table named "book"
CREATE TABLE book (
  id SERIAL PRIMARY KEY,
  title text,
  author text
)
```

Data will be persisted in your database container until it is either removed or destroyed.

Now, let's create a book for this author.

```sh
# In the GraphQL playground
mutation {
  createBook(title:"My first book", author: "5dc1f60d89c31b003d109a1b") {
    id
    title
  }
}

# Output will be something like...
{
  "data": {
    "createBook": {
      "id": 1,
      "title": "My first book"
    }
  }
}
```

### Bring it all together

Now that we have a user stored in our MongoDB and at least one (maybe more) books for that same user stored in our PostgreSQL database, let's run a query that retrieves data from both databases:

```sh
# In the GraphQL playground
{
  books {
    id
    title
    author {
      name
      id
    }
  }
}

# Output will be something like...
{
  "data": {
    "books": [
      {
        "id": 1,
        "title": "My first book",
        "author": {
          "name": "rob",
          "id": "5dc1f60d89c31b003d109a1b"
        }
      }
    ]
  }
}
```

Success!! We have now loaded author information from the `users` collection in our MongoDB, as well as any book `id` or `title` values associated with that author id in PostgreSQL.

## Apollo Graph Manager

### Get a Graph Manager API key

First, we need an Apollo Graph Manager API key. Navigate to [Apollo Graph Manager](https://engine.apollographql.com/), login, and click on New Graph on the sidebar or at the top. The prompt will instruct you to name your graph. When you're finished, click Create Graph. You'll see a key appear prefixed by service:. Copy that key so we can save it as an environment variable.

Let's save our key as an environment variable. It's important to make sure we don't check our Graph Manager API key into version control. Go ahead and make a copy of the `.env.example` file located in server/ and call it `.env`. Add your Graph Manager API key that you copied from the previous step to the file:

### Check and publish with the Apollo CLI

To publish the schema to Graph Manager!, first, start your server in one terminal window with:

```sh
$ npm start
```

Then, publish your GraphQL schema to the Apollo registry:

```sh
# Make sure you are in the back-end/javascript/apollo-server/apollo-tutorial directory
# Check to see if we have any breaking changes in our GraphQL schema before we publish it to the Apollo registry
$ source .env && npx apollo service:check --endpoint=http://localhost:4000

# Push the GraphQL schema to the Apollo registry
$ source .env && npx apollo service:push --endpoint=http://localhost:4000
```

Now if you navigate to [Apollo Graph Manager](https://engine.apollographql.com/), you can dive into your schema and how it is being used.

#### What are the benefits of Graph Manager

Publishing your schema to Apollo Graph Manager unlocks many features necessary for running a graph API in production. Some of these features include:

- Schema explorer: With Graph Manager's powerful schema registry, you can quickly explore all the types and fields in your schema with usage statistics on each field. This metric makes you understand the cost of a field. How expensive is a field? Is a certain field in so much demand?

- Schema history: Apollo Graph Manager schema history allows developers to confidently iterate a graph's schema by validating the new schema against field-level usage data from the previous schema. This empowers developers to avoid breaking changes by providing insights into which clients will be broken by a new schema.

- Performance analytics: Fine-grained insights into every field, resolvers, and operations of your graph's execution

- Client awareness: Report client identity (name and version) to your server for insights on client activity.
