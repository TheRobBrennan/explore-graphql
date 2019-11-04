# Welcome

This code will be modified to follow along with the Apollo tutorial at [https://www.apollographql.com/docs/tutorial/](https://www.apollographql.com/docs/tutorial/).

This guide will contain useful command-line snippets and tidbits as I work through the tutorial circa Monday, October 14th, 2019.

## Apollo server

Before starting this project, you will need to update the `.env.example` file(s) with your own settings and save it as `.env`

In a new terminal window or tab, please navigate to `back-end/javascript/apollo-server/apollo-tutorial`

```sh
# Install our project dependencies
$ npm install

# Start our server
$ npm start
```

## How did we build it?

This server is the same one that has been referenced in the Apollo tutorial at [https://www.apollographql.com/docs/tutorial/](https://www.apollographql.com/docs/tutorial/)

### 1. Build a schema

Our first step will be to install all of our dependencies for the server:

```sh
# Set up Apollo Server
$ npm install
```

See `back-end/javascript/apollo-server/apollo-tutorial/src/schema.js` for how we defined our GraphQL schema.

### 2. Hook up your data sources

Apollo makes connecting these services to your graph simple with our data source API. An Apollo data source is a class that encapsulates all of the data fetching logic, as well as caching and deduplication, for a particular service. By using Apollo data sources to hook up your services to your graph API, you're also following best practices for organizing your code.

```sh
# First, let's connect the Space-X v2 REST API to our graph
# $ npm install apollo-datasource-rest --save

# To build a data source for a REST API, extend the RESTDataSource class and define this.baseURL
# The Apollo RESTDataSource also sets up an in-memory cache that caches responses from our REST resources with no additional setup using partial query caching

# Our REST API is read-only, so we need to connect our graph API to a database for saving and fetching user data.
# Navigate to src/datasources/user.js to see how our UserAPI data source has been created.
# Connect our REST API and SQL database to our server at src/index.js

```

### 3. Write your graph's resolvers

Take a look at `src/resolvers.js` for how we implemented our resolvers.

#### GraphQL queries

Start your server with `npm start` and navigate to [http://localhost:4000/](http://localhost:4000/) to explore the sample GraphQL queries:

```sh
# Get launch details for a specific ID
query GetLaunchById {
  launch(id: 60) {
    id
    rocket {
      id
      type
    }
  }
}

# You can paste { "id": 60 } into the Query Variables section below before running your query.
query GetLaunchById($id: ID!) {
  launch(id: $id) {
    id
    rocket {
      id
      type
    }
  }
}
```

#### Paginated queries

Running the launches query returned a large data set of launches, which can slow down our app. How can we ensure we're not fetching too much data at once?

Pagination is a solution to this problem that ensures that the server only sends data in small chunks. Cursor-based pagination is our recommended approach over numbered pages because it eliminates the possibility of skipping items and displaying the same item more than once. In cursor-based pagination, a constant pointer (or cursor) is used to keep track of wherein the data set the next items should be fetched from.

Notice we have a helper function `paginateResults` already defined for us in `src/utils.js`

##### More GraphQL queries

```sh
query GetLaunches {
  launches(pageSize: 3) {
    launches {
      id
      mission {
        name
      }
    }
  }
}
```

#### Authenticate users

Access control is a feature that almost every app will have to handle at some point. In this tutorial, we're going to focus on teaching you the essential concepts of authenticating users instead of focusing on a specific implementation.

Here are the steps you'll want to follow:

1. The context function on your ApolloServer instance is called with the request object each time a GraphQL operation hits your API. Use this request object to read the authorization headers.
2. Authenticate the user within the context function.
3. Once the user is authenticated, attach the user to the object returned from the context function. This allows us to read the user's information from within our data sources and resolvers, so we can authorize whether they can access the data.

##### Even more GraphQL queries

```sh
mutation LoginUser {
  login(email: "daisy@apollographql.com")
}

Returns
{
  "data": {
    "login": "ZGFpc3lAYXBvbGxvZ3JhcGhxbC5jb20="
  }
}

mutation BookTrips {
  bookTrips(launchIds: [67, 68, 69]) {
    success
    message
    launches {
      id
    }
  }
}

Only authorized users can book trips, so open the `HTTP Headers` box at the bottom of your GraphQL playground and paste in the login code:
{
 "authorization": "ZGFpc3lAYXBvbGxvZ3JhcGhxbC5jb20="
}

You should see a message that your trips were booked successfully.
```

### 4. Run your graph in production

#### Get a Graph Manager API key

First, we need an Apollo Graph Manager API key. Navigate to [Apollo Graph Manager](https://engine.apollographql.com/), login, and click on New Graph on the sidebar or at the top. The prompt will instruct you to name your graph. When you're finished, click Create Graph. You'll see a key appear prefixed by service:. Copy that key so we can save it as an environment variable.

Let's save our key as an environment variable. It's important to make sure we don't check our Graph Manager API key into version control. Go ahead and make a copy of the `.env.example` file located in server/ and call it `.env`. Add your Graph Manager API key that you copied from the previous step to the file:

#### Check and publish with the Apollo CLI

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

##### What are the benefits of Graph Manager

Publishing your schema to Apollo Graph Manager unlocks many features necessary for running a graph API in production. Some of these features include:

- Schema explorer: With Graph Manager's powerful schema registry, you can quickly explore all the types and fields in your schema with usage statistics on each field. This metric makes you understand the cost of a field. How expensive is a field? Is a certain field in so much demand?

- Schema history: Apollo Graph Manager schema history allows developers to confidently iterate a graph's schema by validating the new schema against field-level usage data from the previous schema. This empowers developers to avoid breaking changes by providing insights into which clients will be broken by a new schema.

- Performance analytics: Fine-grained insights into every field, resolvers, and operations of your graph's execution

- Client awareness: Report client identity (name and version) to your server for insights on client activity.
