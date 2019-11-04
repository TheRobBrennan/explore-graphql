# Welcome

After attending the [2019 Apollo GraphQL Summit](https://summit.graphql.com), I wanted to create a space where I could document my exploration of [GraphQL](https://graphql.org) for both front-end and back-end purposes.

I hope that this project will serve as a starting point for anyone interested in exploring [GraphQL](https://graphql.org).

If you would like to contribute to this project, report a bug, or simply offer some feedback, please feel free to [open an issue](https://github.com/TheRobBrennan/explore-graphql/issues) at [https://github.com/TheRobBrennan/explore-graphql/issues](https://github.com/TheRobBrennan/explore-graphql/issues).

The initial goal of this project is to explore arguably one of the leading platforms in the [GraphQL](https://graphql.org) space - the [Apollo Data Graph Platform](https://www.apollographql.com/platform).

If this is your first time exploring [GraphQL](https://graphql.org) or the [Apollo Data Graph Platform](https://www.apollographql.com/platform), I would strongly encourage you to read the [guide](https://www.apollographql.com/docs/) on getting started with the [Apollo Data Graph Platform](https://www.apollographql.com/platform).

## Project structure

If you are familiar with the [Apollo Data Graph Platform](https://www.apollographql.com/platform), you might be a bit surprised to see how this project is structured.

On the front-end, I wanted a place where I could create example apps with popular JavaScript frameworks (such as [React](https://reactjs.org), [Angular](https://angular.io), [Vue](https://vuejs.org), etc) as well as explore creating [GraphQL](https://graphql.org) apps in languages such as [Elixir](https://elixir-lang.org) or [Go](https://golang.org).

On the back-end, I wanted a place where I could create example JavaScript servers (such as [Apollo Server](https://www.apollographql.com/docs/apollo-server/getting-started/), [Node.js](https://nodejs.org/en/), and [Express](https://expressjs.com)) as well as explore servers in languages such as [Elixir](https://elixir-lang.org) or [Go](https://golang.org).

## Getting started

The easiest way to use this repo is to have [Docker](https://www.docker.com) installed and configured on your development machine.

Before starting this project, you will need to update the following `.env.example` file(s) with your own settings and save them as `.env` in their respective directories:

- `back-end/javascript/apollo-server/apollo-tutorial/.env.example` -> `back-end/javascript/apollo-server/apollo-tutorial/.env`
- `front-end/javascript/react/apollo-client/v2.6.x/apollo-tutorial/.env.example` -> `front-end/javascript/react/apollo-client/v2.6.x/apollo-tutorial/.env`

Once this is complete, you can spin up the project by running:

```sh
$ npm start
```

This will create the following Docker containers:

- `apollo-tutorial-app` - A simple [React](https://reactjs.org) web application which is a slightly modified version of the Apollo tutorial at [https://www.apollographql.com/docs/tutorial/](https://www.apollographql.com/docs/tutorial/).
- `apollo-tutorial-server` - The [GraphQL](https://graphql.org) server powered by [Express](https://expressjs.com) which is a slightly modified version of the Apollo tutorial at [https://www.apollographql.com/docs/tutorial/](https://www.apollographql.com/docs/tutorial/).
- `explore-graphql-mongodb` - A [MongoDB](https://www.mongodb.com) server that does not retain data by default
  - Please refer to `docker-compose.yml` to see how you can map a local path if you want to persist your MongoDB data

Assuming you are using the default configuration, you should be able to explore the [GraphQL playground](http://localhost:4000/graphql) by visiting [http://localhost:4000/graphql](http://localhost:4000/graphql) to verify the GraphQL API is running.

Assuming you are using the default configuration, you should be able to see a response from [http://localhost:3000](http://localhost:3000) to verify the front-end web application is running.

Once you have finished with your work - or if you would like to stop the project from running:

```sh
$ npm run docker:down
```
