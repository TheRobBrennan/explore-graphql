# Welcome

This code will be modified to follow along with the Apollo tutorial at [https://www.apollographql.com/docs/tutorial/](https://www.apollographql.com/docs/tutorial/).

This guide will contain useful command line snippets and tidbits as I work through the tutorial circa Monday, October 14th, 2019.

## 1. Build a schema

```sh
# Set up Apollo Server
$ npm install

```

## 2. Hook up your data sources

Apollo makes connecting these services to your graph simple with our data source API. An Apollo data source is a class that encapsulates all of the data fetching logic, as well as caching and deduplication, for a particular service. By using Apollo data sources to hook up your services to your graph API, you're also following best practices for organizing your code.

```sh
# First, let's connect the Space-X v2 REST API to our graph
$ npm install apollo-datasource-rest --save

# To build a data source for a REST API, extend the RESTDataSource class and define this.baseURL
# The Apollo RESTDataSource also sets up an in-memory cache that caches responses from our REST resources with no additional setup using partial query caching

# Our REST API is read-only, so we need to connect our graph API to a database for saving and fetching user data.
# Navigate to start/server/src/datasources/user.js to see how our UserAPI data source has been created.
# Connect our REST API and SQL database to our server at start/server/src/index.js

```

## 3. Write your graph's resolvers

Take a look at `start/server/src/resolvers.js` for how we implemented our resolvers.

### GraphQL queries

Start your server with `npm start` and navigate to [http://localhost:4000/](http://localhost:4000/) to explore the sample GraphQL queries:

```sh
# Get our launches
query GetLaunches {
  launches {
    id
    mission {
      name
    }
  }
}

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

### Paginated queries

Running the launches query returned a large data set of launches, which can slow down our app. How can we ensure we're not fetching too much data at once?

Pagination is a solution to this problem that ensures that the server only sends data in small chunks. Cursor-based pagination is our recommended approach over numbered pages, because it eliminates the possibility of skipping items and displaying the same item more than once. In cursor-based pagination, a constant pointer (or cursor) is used to keep track of where in the data set the next items should be fetched from.

Notice we have a helper function `paginateResults` already defined for us in `start/server/src/utils.js`

#### GraphQL queries

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

### Authenticate users

Access control is a feature that almost every app will have to handle at some point. In this tutorial, we're going to focus on teaching you the essential concepts of authenticating users instead of focusing on a specific implementation.

Here are the steps you'll want to follow:

1. The context function on your ApolloServer instance is called with the request object each time a GraphQL operation hits your API. Use this request object to read the authorization headers.
2. Authenticate the user within the context function.
3. Once the user is authenticated, attach the user to the object returned from the context function. This allows us to read the user's information from within our data sources and resolvers, so we can authorize whether they can access the data.

#### GraphQL queries

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

## 4. Run your graph in production

### Get a Graph Manager API key

First, we need an Apollo Graph Manager API key. Navigate to [Apollo Graph Manager](https://engine.apollographql.com/), login, and click on New Graph on the sidebar or at the top. The prompt will instruct you to name your graph. When you're finished, click Create Graph. You'll see a key appear prefixed by service:. Copy that key so we can save it as an environment variable.

Let's save our key as an environment variable. It's important to make sure we don't check our Graph Manager API key into version control. Go ahead and make a copy of the `.env.example` file located in server/ and call it `.env`. Add your Graph Manager API key that you copied from the previous step to the file:

### Check and publish with the Apollo CLI

To publish the schema to Graph Manager!, first start your server in one terminal window with:

```sh
$ npm start
```

Then, publish your GraphQL schema to the Apollo registry:

```sh
# Check to see if we have any breaking changes in our GraphQL schema before we publish it to the Apollo registry
$ npx apollo service:check --endpoint=http://localhost:4000

# Push the GraphQL schema to the Apollo registry
$ npx apollo service:push --endpoint=http://localhost:4000
```

Now if you navigate to [Apollo Graph Manager](https://engine.apollographql.com/), you can dive into your schema and how it is being used.

#### What are the benefits of Graph Manager

Publishing your schema to Apollo Graph Manager unlocks many features necessary for running a graph API in production. Some of these features include:

+ Schema explorer: With Graph Manager's powerful schema registry, you can quickly explore all the types and fields in your schema with usage statistics on each field. This metric makes you understand the cost of a field. How expensive is a field? Is a certain field in so much demand?

+ Schema history: Apollo Graph Manager schema history allows developers to confidently iterate a graph's schema by validating the new schema against field-level usage data from the previous schema. This empowers developers to avoid breaking changes by providing insights into which clients will be broken by a new schema.

+ Performance analytics: Fine-grained insights into every field, resolvers and operations of your graph's execution

+ Client awareness: Report client identity (name and version) to your server for insights on client activity.

## 5. Connect your API to a client

Please refer to `start/client/src/index.js` to see this in action.

IMPORTANT: This tutorial assumes that you will have your back-end GraphQL Apollo server up and running - and you have completed the first four (4) steps as discussed above.

### Apollo VSCode

If you are using Apollo VSCode, please be sure to make a copy of the `.env.example` file located in client/ and call it `.env` - updating it with the Graph Manager API key you already created in step four (4) above.

Next, create an Apollo config file called `apollo.config.js` - this config file is how you configure both the Apollo VSCode extension and CLI.

### Create an Apollo Client

### Connect your client to React

## 6. Fetch data with queries

To create a component with `useQuery`, import `useQuery` from `@apollo/react-hooks`, pass your query wrapped with `gql` in as the first parameter, then wire your component up to use the loading, data, and error properties on the result object to render UI in your app.

Why are we wrapping our GraphQL query with `gql`? We need to wrap the query with the `gql` function in order to parse it into an AST.

### Fetching a list

Refer to `start/client/src/pages/launches.js` - notice how our `GET_LAUNCHES` query is defined. It contains both `cursor` and `hasMore` properties - as well as an object type with a list of launches.

At this stage of our tutorial, note that we are only fetching the first twenty (20) launches from the list. To display the full list of launches, we need to build a pagination feature.

### Build a paginated list

Refer to `start/client/src/pages/launches.js` - Apollo Client has built-in helpers to make adding pagination to our app much easier than it would be if we were writing the logic ourselves.

To build a paginated list with Apollo, we first need to destructure the `fetchMore` function from the `useQuery` result object.

Let's navigate to `src/pages/launch.js` to build out our detail page. Let's render a component with `useQuery` to execute it. This time, we'll also need to pass in the `launchId` as a variable to the query, which we'll do by adding a `variables` option to `useQuery`. The `launchId` comes through as a prop from the router.

### Customizing the fetch policy

Sometimes, it's useful to tell Apollo Client to bypass the cache altogether if you have some data that constantly needs to be refreshed. We can do this by customizing the useQuery hook's fetchPolicy.

First, let's navigate to `src/pages/profile.js` and write our query.

By default, Apollo Client's fetch policy is `cache-first`, which means it checks the cache to see if the result is there before making a network request. Since we want this list to always reflect the newest data from our graph API, we set the `fetchPolicy` for this `query` to `network-only`.

## 7. Update data with mutations

With Apollo Client, updating data from a graph API is as simple as calling a function. Additionally, the Apollo Client cache is smart enough to automatically update in most cases. In this section, we'll learn how to use the `useMutation` hook to login a user.

The useMutation hook is another important building block in an Apollo app. It leverages React's Hooks API to provide a function to execute a GraphQL mutation. Additionally, it tracks the loading, completion, and error state of that mutation.

Updating data with a useMutation hook from @apollo/react-hooks is very similar to fetching data with a useQuery hook. The main difference is that the first value in the useMutation result tuple is a mutate function that actually triggers the mutation when it is called. The second value in the result tuple is a result object that contains loading and error state, as well as the return value from the mutation.

### Update data with useMutation

Refer to `start/client/src/pages/login.js`

### Expose Apollo Client with useApolloClient

One of the main functions of React Apollo is that it puts your ApolloClient instance on React's context. Sometimes, we need to access the ApolloClient instance to directly call a method that isn't exposed by the @apollo/react-hooks helper components. The `useApolloClient` hook can help us access the client.

Let's call `useApolloClient` to get the currently configured client instance. Next, we want to pass an `onCompleted` callback to `useMutation` that will be called once the mutation is complete with its return value. This callback is where we will save the login token to `localStorage`.

In our `onCompleted` handler, we also call `client.writeData` to write local data to the Apollo cache indicating that the user is logged in. This is an example of a direct write that we'll explore further in the next section on local state management.

Let's take a look at `start/client/src/pages/login.js`

## 8. Manage local state

In almost every app we build, we display a combination of remote data from our graph API and local data such as network status, form state, and more. What's awesome about Apollo Client is that it allows us to store local data inside the Apollo cache and query it alongside our remote data with GraphQL.

We recommend managing local state in the Apollo cache instead of bringing in another state management library like Redux so the Apollo cache can be a single source of truth.

Managing local data with Apollo Client is very similar to how you've already managed remote data in this tutorial. You'll write a client schema and resolvers for your local data. You'll also learn to query it with GraphQL just by specifying the @client directive. Let's dive in!

### Write a local schema

Just like how a schema is the first step toward defining our data model on the server, writing a local schema is the first step we take on the client.

Refer to `src/resolvers.js` - to build a client schema, we extend the types of our server schema and wrap it with the gql function. Using the extend keyword allows us to combine both schemas inside developer tooling like Apollo VSCode and Apollo DevTools.

We can also add local fields to server data by extending types from our server. Here, we're adding the `isInCart` local field to the `Launch` type we receive back from our graph API.

### Initialize the store

Now that we've created our client schema, let's learn how to initialize the store. Since queries execute as soon as the component mounts, it's important for us to warm the Apollo cache with some default state so those queries don't error out. We will need to write initial data to the cache for both `isLoggedIn` and `cartItems`

Jump back to `src/index.js` and notice we had already added a `cache.writeData` call to prepare the cache in the last section. While we're here, make sure to also import the `typeDefs` and `resolvers` that we just created so we can use them later.

### Query local data

Querying local data from the Apollo cache is almost the same as querying remote data from a graph API. The only difference is that you add a @client directive to a local field to tell Apollo Client to pull it from the cache.

Refer to `start/client/src/index.js` - Let's look at an example where we query the `isLoggedIn` field we wrote to the cache in the last mutation exercise. 

First, we create our IsUserLoggedIn local query by adding the @client directive to the isLoggedIn field. Then, we render a component with useQuery, pass our local query in, and based on the response render either a login screen or the homepage depending if the user is logged in. Since cache reads are synchronous, we don't have to account for any loading state.

Let's look at another example of a component that queries local state in `src/pages/cart.js`.

### Adding virtual fields to server data

One of the unique advantages of managing your local data with Apollo Client is that you can add virtual fields to data you receive back from your graph API. These fields only exist on the client and are useful for decorating server data with local state. In our example, we're going to add an `isInCart` virtual field to our `Launch` type.

To add a virtual field, first extend the type of the data you're adding the field to in your client schema - as in `start/client/src/resolvers.js` - and then specify a client resolver on the Launch type to tell Apollo Client how to resolve your virtual field.

### Update local data

Up until now, we've focused on querying local data from the Apollo cache. Apollo Client also lets you update local data in the cache with either direct cache writes or client resolvers. Direct writes are typically used to write simple booleans or strings to the cache whereas client resolvers are for more complicated writes such as adding or removing data from a list.

#### Direct cache writes

Direct cache writes are convenient when you want to write a simple field, like a boolean or a string, to the Apollo cache. We perform a direct write by calling `client.writeData()` and passing in an object with a data property that corresponds to the data we want to write to the cache. We've already seen an example of a direct write, when we called `client.writeData` in the `onCompleted` handler for the login `useMutation` based component.

Refer to `start/client/src/containers/logout-button.js` - Let's look at a similar example, where we copy the code below to create a logout button.

When we click the button, we perform a direct cache write by calling `client.writeData` and passing in a data object that sets the `isLoggedIn` boolean to `false`.

Refer to `start/client/src/containers/book-trips.js` - we can also perform direct writes within the `update` function of the `useMutation` hook. The `update` function allows us to manually update the cache after a mutation occurs without refetching data.

#### Local resolvers

We're not done yet! What if we wanted to perform a more complicated local data update such as adding or removing items from a list? For this situation, we'll use a local resolver. Local resolvers have the same function signature as remote resolvers `((parent, args, context, info) => data)`. The only difference is that the Apollo cache is already added to the context for you. Inside your resolver, you'll use the cache to read and write data.

Refer to `start/client/src/resolvers.js` - Let's write the local resolver for the `addOrRemoveFromCart` mutation. You should place this resolver underneath the Launch resolver we wrote earlier. In this resolver, we destructure the Apollo cache from the context in order to read the query that fetches cart items. Once we have our cart data, we either remove or add the cart item's id passed into the mutation to the list. Finally, we return the updated list from the mutation.

Refer to `start/client/src/containers/action-button.js` - Let's see how we call the `addOrRemoveFromCart` mutation in a component.
