# EXAMPLE: Client/server using both MongoDB and PostgreSQL

What if we have a back-end server that needs to work with more than one back-end database?

Please take a look at the guide at `back-end/javascript/apollo-server/example-using-mongodb-and-postgresql/README.md` to see some important notes and example queries/mutations - as well as an important SQL command that you must run once your PostgreSQL server is up and running.

Before starting this project, you will need to update the following `.env.example` file(s) with your own settings and save them as `.env` in their respective directories:

- `back-end/javascript/apollo-server/example-using-mongodb-and-postgresql/.env.example` -> `back-end/javascript/apollo-server/example-using-mongodb-and-postgresql/.env`

Once this is complete, you can spin up the project by running:

```sh
$ npm run start

# If you have made any changes to any Docker related files or package.json, you can force a clean build of the app with:
$ npm run build
```

This will create the following Docker containers:

- `explore-graphql-app` - A simple [React](https://reactjs.org) web application
- `explore-graphql-server` - The [GraphQL](https://graphql.org) server
- `explore-graphql-mongodb` - A [MongoDB](https://www.mongodb.com) server that does not retain data by default
  - This MongoDB server is **NOT USED BY THE TUTORIAL** but simply included for reference on adding additional database servers or services
  - Please refer to `docker-compose.example-server-using-mongodb-and-postgresql.yml` to see how you can map a local path if you want to persist your MongoDB data
- `explore-graphql-postgresql` - A [PostgreSQL](https://www.postgresql.org) server that does not retain data by default
  - This PostgreSQL server is **NOT USED BY THE TUTORIAL** but simply included for reference on adding additional database servers or services
  - Please refer to `docker-compose.example-server-using-mongodb-and-postgresql.yml` to see how you can map a local path if you want to persist your data

You should be able to explore the [GraphQL playground](http://localhost:4000/graphql) by visiting [http://localhost:4000/graphql](http://localhost:4000/graphql) to verify the GraphQL API is running.

Once you have finished with your work - or if you would like to stop the project from running - you can press CTRL+C and watch the application gracefully shut down:

When you are finished, simply press CTRL+C to spin down the app:

```sh
^CGracefully stopping... (press Ctrl+C again to force)
```

Finally, you can spin down and remove the Docker container(s) for this app with:

```sh
$ npm run stop
Stopping explore-graphql-app                      ... done
Stopping explore-graphql-server-mongoose-and-knex ... done
Stopping explore-graphql-mongodb                  ... done
Stopping explore-graphql-postgresql               ... done
Removing explore-graphql-app                      ... done
Removing explore-graphql-server-mongoose-and-knex ... done
Removing explore-graphql-mongodb                  ... done
Removing explore-graphql-postgresql               ... done
Removing network client-server-with-mongodb-and-postgresql_default
```
