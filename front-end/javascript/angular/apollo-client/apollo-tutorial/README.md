# ApolloTutorial

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.17.

## Getting started

To create a new app from scratch using [Apollo client for Angular](https://www.apollographql.com/docs/angular/):

```sh
$ ng new my-app

# Installation with Angular Schematics
$ cd my-app
$ ng add apollo-angular

# Generate a new app-exchange-rates component
$ ng g c exchange-rates --module app

```

## Queries

### Basic queries

When we are using a basic query, we can use the `Apollo.watchQuery` method in a very simple way. We simply need to parse our query into a GraphQL document using the `graphql-tag` library.

Take a look at how we modified `src/app/exchange-rates/exchange-rates.component.ts` to demonstrate a couple of examples querying data.

It's also possible to fetch data only once. The `query` method of Apollo service returns an Observable that also resolves with the same result.

### What is QueryRef

As you know, `Apollo.query` method returns an Observable that emits a result, just once. `Apollo.watchQuery` also does the same, except it can emit multiple results. (The GraphQL query itself is still only sent once, but the watchQuery observable can also update if, for example, another query causes the object to be updated within Apollo Client's global cache.)

So why doesn't `Apollo.watchQuery` expose an Observable?

Apollo service and ApolloClient share pretty much the same API. It makes things easy to understand and use. No reason to change it.

In `ApolloClient.watchQuery` returns an Observable, but not a standard one, it contains many useful methods (like `refetch()`) to manipulate the watched query. A normal Observable, has only one method, `subscribe()`.

To use that Apollo's Observable in RxJS, we would have to drop those methods. Since they are necessary to use Apollo to its full potential, we had to come up with a solution.

This is why we created `QueryRef`.

The API of `QueryRef` is very simple. It has the same methods as the `Apollo Observable` we talked about. To subscribe to query results, you have to access its valueChanges property which exposes a clean RxJS Observable.

It's worth mentioning that `QueryRef` accepts two generic types. More about that in Static Typing.

### Providing options

`watchQuery` and `query` methods expect one argument, an object with options. If you want to configure the `query`, you can provide any available option in the same object where the query key lives.

If your `query` takes variables, this is the place to pass them in:

```javascript
// Suppose our profile query took an avatar size
const CurrentUserForProfile = gql`
  query CurrentUserForProfile($avatarSize: Int!) {
    currentUser {
      login
      avatar_url(avatarSize: $avatarSize)
    }
  }
`;

@Component({
  template: `
    Login: {{currentUser?.profile}}
  `,
})
class ProfileComponent implements OnInit, OnDestroy {
  currentUser: any;
  private querySubscription: Subscription;
  ngOnInit() {
    this.querySubscription = this.apollo
      .watchQuery({
        query: CurrentUserForProfile,
        variables: {
          avatarSize: 100,
        },
      })
      .valueChanges.subscribe(({data}) => {
        this.currentUser = data.currentUser;
      });
  }
  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
```

### Using with AsyncPipe

In Angular, the simplest way of displaying data that comes from Observable is to put AsyncPipe on top of the property inside the UI. You can also achieve this with Apollo.

Note: Using async pipe more than once in your template will trigger the query for each pipe. To avoid this situation, subscribe to the data in the component, and display the data from the component's property.

An Observable returned by `watchQuery().valueChanges` holds the actual result under the data field, so you can not directly access one of the properties of that object.

This is why we created `SelectPipe`. The only argument it receives is the name of the property you want to get from data.

```javascript
import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import gql from 'graphql-tag';

const FeedQuery = gql`
  query Feed {
    currentUser {
      login
    }
    feed {
      createdAt
      score
    }
  }
`;

@Component({
  template: `
    <ul *ngFor="let entry of data | async | select: 'feed'">
      Score: {{entry.score}}
    </ul>
  `,
})
class FeedComponent implements OnInit {
  data: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.data = this.apollo.watchQuery({query: FeedQuery}).valueChanges;
  }
}
```

Without using SelectPipe, you would get the whole object instead of only the `data.feed`.

### Using with RxJS

Apollo is compatible with RxJS by using same `Observable` so it can be used with operators.

What's really interesting is that, because of this, you can avoid using SelectPipe:

```javascript
import {Component, OnInit} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import gql from 'graphql-tag';

const FeedQuery = gql`
  query Feed {
    currentUser {
      login
    }
    feed {
      createdAt
      score
    }
  }
`;

@Component({
  template: `
    <ul *ngFor="let entry of data | async">
      Score: {{entry.score}}
    </ul>
  `,
})
class FeedComponent implements OnInit {
  data: Observable<any>;

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.data = this.apollo
      .watchQuery({query: FeedQuery})
      .valueChanges.pipe(map(({data}) => data.feed));
  }
}
```

The `map` operator we are using here is provided by the RxJS Observable which serves as the basis for the Observable.

To be able to use the `map` operator (and most others like `switchMap`, `filter`, `merge`, ...) these have to be explicitly imported as done in the example: `import {map} from 'rxjs/operators';`

## Mutations

## Query, Mutation, Subscription services

## Network layer (Apollo link)

## Apollo Cache

## Local state management

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
