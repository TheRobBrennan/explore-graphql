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

### EXAMPLE: Apollo Fullstack GraphQL Tutorial

This example is a slightly modified version of the Apollo fullstack GraphQL tutorial at [https://www.apollographql.com/docs/tutorial/](https://www.apollographql.com/docs/tutorial/).

Before starting this project, you will need to update the following `.env.example` file(s) with your own settings and save them as `.env` in their respective directories:

- `back-end/javascript/apollo-server/apollo-tutorial/.env.example` -> `back-end/javascript/apollo-server/apollo-tutorial/.env`
- `front-end/javascript/react/apollo-client/v2.6.x/apollo-tutorial/.env.example` -> `front-end/javascript/react/apollo-client/v2.6.x/apollo-tutorial/.env`

Once this is complete, you can spin up the project by running:

```sh
$ npm run docker:apollo-tutorial:up
apollo-tutorial-server | Loaded 'mongodb:27017' in [1] seconds
apollo-tutorial-server | wait done with status=0
apollo-tutorial-server | [nodemon] 1.19.3
apollo-tutorial-server | [nodemon] to restart at any time, enter `rs`
apollo-tutorial-server | [nodemon] watching dir(s): *.*
apollo-tutorial-server | [nodemon] watching extensions: js,json,graphql
apollo-tutorial-server | [nodemon] starting `node src/index.js`
apollo-tutorial-app | Starting the development server...
apollo-tutorial-app | 
apollo-tutorial-server | 🚀 Server ready at http://localhost:4000/
apollo-tutorial-app | Compiled successfully!
apollo-tutorial-app | 
apollo-tutorial-app | You can now view client in the browser.
apollo-tutorial-app | 
apollo-tutorial-app |   Local:            http://localhost:3000/
apollo-tutorial-app |   On Your Network:  http://172.26.0.4:3000/
apollo-tutorial-app | 
apollo-tutorial-app | Note that the development build is not optimized.
apollo-tutorial-app | To create a production build, use yarn build.
apollo-tutorial-app | 

```

This will create the following Docker containers:

- `apollo-tutorial-app` - A simple [React](https://reactjs.org) web application
- `apollo-tutorial-server` - The [GraphQL](https://graphql.org) server

You should be able to explore the [GraphQL playground](http://localhost:4000/graphql) by visiting [http://localhost:4000/graphql](http://localhost:4000/graphql) to verify the GraphQL API is running.

You should be able to see a response from [http://localhost:3000](http://localhost:3000) to verify the front-end web application is running.

Once you have finished with your work - or if you would like to stop the project from running - you can press CTRL+C and watch the application gracefully shut down:

```sh
# Press CTRL+C one time (pressing it twice will force the application to quit)
^CGracefully stopping... (press Ctrl+C again to force)
Stopping apollo-tutorial-app      ... done
Stopping apollo-tutorial-server   ... done
```

### EXAMPLE: Client/server app with MongoDB

If you would like to experiment with a MongoDB back-end database for your project, you can spin up the example Apollo client and server app (see "EXAMPLE: Apollo Fullstack GraphQL Tutorial" to make sure you have configured the examples correctly) with the `docker-compose.example-client-server-with-mongodb.yml` file.

Once this is complete, you can spin up the project by running:

```sh
$ npm run docker:example-client-server-with-mongodb:up

```

This will create the following Docker containers:

- `explore-graphql-app` - A simple [React](https://reactjs.org) web application
- `explore-graphql-server` - The [GraphQL](https://graphql.org) server
- `explore-graphql-mongodb` - A [MongoDB](https://www.mongodb.com) server that does not retain data by default
  - This MongoDB server is **NOT USED BY THE TUTORIAL** but simply included for reference on adding additional database servers or services
  - Please refer to `docker-compose.example-client-server-with-mongodb.yml` to see how you can map a local path if you want to persist your MongoDB data

You should be able to explore the [GraphQL playground](http://localhost:4000/graphql) by visiting [http://localhost:4000/graphql](http://localhost:4000/graphql) to verify the GraphQL API is running.

You should be able to see a response from [http://localhost:3000](http://localhost:3000) to verify the front-end web application is running.

Once you have finished with your work - or if you would like to stop the project from running - you can press CTRL+C and watch the application gracefully shut down:

```sh
^CGracefully stopping... (press Ctrl+C again to force)

Stopping explore-graphql-app      ... done
Stopping explore-graphql-server   ... done
Stopping explore-graphql-mongodb  ... done
```
