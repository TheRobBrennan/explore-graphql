# Welcome

This code will be modified to follow along with the Apollo tutorial at [https://www.apollographql.com/docs/tutorial/](https://www.apollographql.com/docs/tutorial/).

This guide will contain useful command line snippets and tidbits as I work through the tutorial circa Monday, October 14th, 2019.

## Apollo client

## 5. Connect your API to a client

Please refer to `src/index.js` to see this in action.

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

Refer to `src/pages/launches.js` - notice how our `GET_LAUNCHES` query is defined. It contains both `cursor` and `hasMore` properties - as well as an object type with a list of launches.

At this stage of our tutorial, note that we are only fetching the first twenty (20) launches from the list. To display the full list of launches, we need to build a pagination feature.

### Build a paginated list

Refer to `src/pages/launches.js` - Apollo Client has built-in helpers to make adding pagination to our app much easier than it would be if we were writing the logic ourselves.

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

Refer to `src/pages/login.js`

### Expose Apollo Client with useApolloClient

One of the main functions of React Apollo is that it puts your ApolloClient instance on React's context. Sometimes, we need to access the ApolloClient instance to directly call a method that isn't exposed by the @apollo/react-hooks helper components. The `useApolloClient` hook can help us access the client.

Let's call `useApolloClient` to get the currently configured client instance. Next, we want to pass an `onCompleted` callback to `useMutation` that will be called once the mutation is complete with its return value. This callback is where we will save the login token to `localStorage`.

In our `onCompleted` handler, we also call `client.writeData` to write local data to the Apollo cache indicating that the user is logged in. This is an example of a direct write that we'll explore further in the next section on local state management.

Let's take a look at `src/pages/login.js`

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

Refer to `src/index.js` - Let's look at an example where we query the `isLoggedIn` field we wrote to the cache in the last mutation exercise.

First, we create our IsUserLoggedIn local query by adding the @client directive to the isLoggedIn field. Then, we render a component with useQuery, pass our local query in, and based on the response render either a login screen or the homepage depending if the user is logged in. Since cache reads are synchronous, we don't have to account for any loading state.

Let's look at another example of a component that queries local state in `src/pages/cart.js`.

### Adding virtual fields to server data

One of the unique advantages of managing your local data with Apollo Client is that you can add virtual fields to data you receive back from your graph API. These fields only exist on the client and are useful for decorating server data with local state. In our example, we're going to add an `isInCart` virtual field to our `Launch` type.

To add a virtual field, first extend the type of the data you're adding the field to in your client schema - as in `src/resolvers.js` - and then specify a client resolver on the Launch type to tell Apollo Client how to resolve your virtual field.

### Update local data

Up until now, we've focused on querying local data from the Apollo cache. Apollo Client also lets you update local data in the cache with either direct cache writes or client resolvers. Direct writes are typically used to write simple booleans or strings to the cache whereas client resolvers are for more complicated writes such as adding or removing data from a list.

#### Direct cache writes

Direct cache writes are convenient when you want to write a simple field, like a boolean or a string, to the Apollo cache. We perform a direct write by calling `client.writeData()` and passing in an object with a data property that corresponds to the data we want to write to the cache. We've already seen an example of a direct write, when we called `client.writeData` in the `onCompleted` handler for the login `useMutation` based component.

Refer to `src/containers/logout-button.js` - Let's look at a similar example, where we copy the code below to create a logout button.

When we click the button, we perform a direct cache write by calling `client.writeData` and passing in a data object that sets the `isLoggedIn` boolean to `false`.

Refer to `src/containers/book-trips.js` - we can also perform direct writes within the `update` function of the `useMutation` hook. The `update` function allows us to manually update the cache after a mutation occurs without refetching data.

#### Local resolvers

We're not done yet! What if we wanted to perform a more complicated local data update such as adding or removing items from a list? For this situation, we'll use a local resolver. Local resolvers have the same function signature as remote resolvers `((parent, args, context, info) => data)`. The only difference is that the Apollo cache is already added to the context for you. Inside your resolver, you'll use the cache to read and write data.

Refer to `src/resolvers.js` - Let's write the local resolver for the `addOrRemoveFromCart` mutation. You should place this resolver underneath the Launch resolver we wrote earlier. In this resolver, we destructure the Apollo cache from the context in order to read the query that fetches cart items. Once we have our cart data, we either remove or add the cart item's id passed into the mutation to the list. Finally, we return the updated list from the mutation.

Refer to `src/containers/action-button.js` - Let's see how we call the `addOrRemoveFromCart` mutation in a component.
