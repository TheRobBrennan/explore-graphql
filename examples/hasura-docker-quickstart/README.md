# EXAMPLE: Hasura Docker quickstart

This example is a slightly modified version of the [Quickstart with Docker](https://docs.hasura.io/1.0/graphql/manual/getting-started/docker-simple.html).

You can spin up the project by running:

```sh
$ npm run start

# If you have made any changes to any Docker related files or package.json, you can force a clean build of the app with:
$ npm run build
```

This will create the following Docker containers:

- `hasura-graphql-api` - This is the [Hasura Console](https://hasura.io) - which contains the front-end application to work with the Hasura GraphQL engine
- `hasura-graphql-db` - A [PostgreSQL](https://www.postgresql.org) server that does not retain data by default
  - This PostgreSQL server is **NOT USED BY THE TUTORIAL** but simply included for reference on adding additional database servers or services
  - Please refer to `docker-compose.yml` to see how you can map a local path if you want to persist your data

You should be able visit [http://localhost:8080/console](http://localhost:8080/console) to verify the Hasura GraphQL application is running.

When you are finished, simply press CTRL+C to spin down the app:

```sh
^CERROR: Aborting.
```

Finally, you can spin down and remove the Docker container(s) for this app with:

```sh
$ npm run stop
Stopping hasura-graphql-api ... done
Stopping hasura-graphql-db  ... done
Removing hasura-graphql-api ... done
Removing hasura-graphql-db  ... done
Removing network hasura-docker-quickstart_default
```
