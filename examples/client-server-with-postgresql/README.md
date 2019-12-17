# EXAMPLE: Client/server app with PostgreSQL

If you would like to experiment with a PostgreSQL back-end database for your project, you can spin up the example Apollo client and server app (see `examples/apollo-tutorial-react` to make sure you have configured the examples correctly) with the `docker-compose.yml` file in this folder.

Once this is complete, you can spin up the project by running:

```sh
$ npm run start

# If you have made any changes to any Docker related files or package.json, you can force a clean build of the app with:
$ npm run build
```

This will create the following Docker containers:

- `explore-graphql-app` - A simple [React](https://reactjs.org) web application
- `explore-graphql-server` - The [GraphQL](https://graphql.org) server
- `explore-graphql-postgresql` - A [PostgreSQL](https://www.postgresql.org) server that does not retain data by default
  - This PostgreSQL server is **NOT USED BY THE TUTORIAL** but simply included for reference on adding additional database servers or services
  - Please refer to `docker-compose.yml` to see how you can map a local path if you want to persist your data

You should be able to explore the [GraphQL playground](http://localhost:4000/graphql) by visiting [http://localhost:4000/graphql](http://localhost:4000/graphql) to verify the GraphQL API is running.

You should be able to see a response from [http://localhost:3000](http://localhost:3000) to verify the front-end web application is running.

Once you have finished with your work - or if you would like to stop the project from running - you can press CTRL+C and watch the application gracefully shut down:

When you are finished, simply press CTRL+C to spin down the app:

```sh
^CGracefully stopping... (press Ctrl+C again to force)
```

Finally, you can spin down and remove the Docker container(s) for this app with:

```sh
$ npm run stop
Removing explore-graphql-app        ... done
Removing explore-graphql-server     ... done
Removing explore-graphql-postgresql ... done
Removing network client-server-with-postgresql_default
```
