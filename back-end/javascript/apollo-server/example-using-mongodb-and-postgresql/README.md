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
