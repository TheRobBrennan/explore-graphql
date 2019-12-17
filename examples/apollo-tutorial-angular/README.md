# EXAMPLE: Apollo tutorial for Angular

This example is a slightly modified version of the [Apollo tutorial for Angular](https://www.apollographql.com/docs/angular/basics/setup/) available at [https://www.apollographql.com/docs/angular/basics/setup/](https://www.apollographql.com/docs/angular/basics/setup/).

You can spin up the project by running:

```sh
$ npm run start

# If you have made any changes to any Docker related files or package.json, you can force a clean build of the app with:
$ npm run build
```

This will create the following Docker containers:

- `apollo-tutorial-angular` - A simple [Angular](https://angular.io) web application

You should be able visit [http://localhost:4200](http://localhost:4200) to verify the front-end web application is running.

When you are finished, simply press CTRL+C to spin down the app:

```sh
^CERROR: Aborting.
```

Finally, you can spin down and remove the Docker container(s) for this app with:

```sh
$ npm run stop
Stopping apollo-tutorial-angular ... done
Removing apollo-tutorial-angular ... done
Removing network apollo-tutorial-angular_default

```
