# EXAMPLE: Apollo Fullstack GraphQL Tutorial

This example is a slightly modified version of the Apollo fullstack GraphQL tutorial at [https://www.apollographql.com/docs/tutorial/](https://www.apollographql.com/docs/tutorial/).

Before starting this project, you will need to update the following `.env.example` file(s) with your own settings and save them as `.env` in their respective directories:

- `back-end/javascript/apollo-server/apollo-tutorial/.env.example` -> `back-end/javascript/apollo-server/apollo-tutorial/.env`
- `front-end/javascript/react/apollo-client/v2.6.x/apollo-tutorial/.env.example` -> `front-end/javascript/react/apollo-client/v2.6.x/apollo-tutorial/.env`

Once this is complete, you can spin up the project by running:

```sh
$ npm run start

# If you have made any changes to any Docker related files or package.json, you can force a clean build of the app with:
$ npm run build
```

This will create the following Docker containers:

- `apollo-tutorial-app` - A simple [React](https://reactjs.org) web application
- `apollo-tutorial-server` - The [GraphQL](https://graphql.org) server

You should be able to explore the [GraphQL playground](http://localhost:4000/graphql) by visiting [http://localhost:4000/graphql](http://localhost:4000/graphql) to verify the GraphQL API is running.

You should be able to see a response from [http://localhost:3000](http://localhost:3000) to verify the front-end web application is running.

When you are finished, simply press CTRL+C to spin down the app:

```sh
^CGracefully stopping... (press Ctrl+C again to force)
```

Finally, you can spin down and remove the Docker container(s) for this app with:

```sh
$ npm run stop
Stopping apollo-tutorial-app    ... done
Stopping apollo-tutorial-server ... done
Removing apollo-tutorial-app    ... done
Removing apollo-tutorial-server ... done
Removing network apollo-tutorial-react_default
```
