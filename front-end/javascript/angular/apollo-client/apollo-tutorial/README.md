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

In addition to fetching data using queries, Apollo also handles GraphQL mutations. Mutations are identical to queries in syntax, the only difference being that you use the keyword `mutation` instead of `query` to indicate that the operation is used to change the dataset behind the schema.

GraphQL mutations consist of two parts:

+ The mutation name with arguments (`submitRepository`), which represents the actual operation to be done on the server
+ The fields you want back from the result of the mutation to update the client (`id` and `repoName`)

```sh
mutation {
  submitRepository(repoFullName: "apollographql/apollo-client") {
    id
    repoName
  }
}

# The result of the above mutation might be:
{
  "data": {
    "submitRepository": {
      "id": "123",
      "repoName": "apollographql/apollo-client"
    }
  }
}
```

When we use mutations in Apollo, the result is typically integrated into the cache automatically based on the id of the result, which in turn updates UI automatically, so we don't explicitly handle the results ourselves. In order for the client to correctly do this, we need to ensure we select the correct fields (as in all the fields that we care about that may have changed).

### Basic mutations

Using Apollo it's easy to call mutation. You can simply use `mutate` method.

Most mutations will require arguments in the form of query variables, and you may wish to provide other options to `ApolloClient#mutate`. You can directly pass options to `mutate` when you call it in the wrapped component:

```javascript
import { Component } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const submitRepository = gql`
  mutation submitRepository($repoFullName: String!) {
    submitRepository(repoFullName: $repoFullName) {
      createdAt
    }
  }
`;

@Component({ ... })
class NewEntryComponent {
  constructor(private apollo: Apollo) {}

  newRepository() {
    this.apollo.mutate({
      mutation: submitRepository,
      variables: {
        repoFullName: 'apollographql/apollo-client'
      }
    }).subscribe(({ data }) => {
      console.log('got data', data);
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }
}
```

As you can see, `mutate` method returns an Observable that resolves with `ApolloQueryResult`. It is the same result we get when we fetch queries.

However, typically you'd want to keep the concern of understanding the mutation's structure out of your presentational component. The best way to do this is to use a service to bind your mutate function:

```javascript
import {Component, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable()
class SubmitRepositoryService {
  mutation = gql`
      mutation submitRepository($repoFullName: String!) {
        submitRepository(repoFullName: $repoFullName) {
          createdAt
        }
  }`;

  constructor(private apollo: Apollo) {}

  submitRepository(repoFullName: string) {
    return this.apollo.mutate({
      mutation: this.mutation,
      variables: {
        repoFullName: repoFullName
      }
    });
  }
}


@Component({ ... })
class NewEntryComponent {
  constructor(private submitRepoService: SubmitRepositoryService) {}

  newRepository() {
    this.submitRepoService.submitRepository('apollographql/apollo-client')
      .subscribe(({ data }) => {
        console.log('got data', data);
      }, (error) => {
        console.log('there was an error sending the query', error);
      });
  }
}
```

Note that in general you shouldn't attempt to use the results from the mutation callback directly, instead you can rely on Apollo's id-based cache updating to take care of it for you, or if necessary passing an updateQueries callback to update the result of relevant queries with your mutation results.

### Optimistic UI

Sometimes your client code can easily predict the result of the mutation, if it succeeds, even before the server responds with the result. For instance, in GitHunt, when a user comments on a repository, we want to show the new comment in context immediately, without waiting on the latency of a round trip to the server, giving the user the experience of a snappy UI. This is what we call Optimistic UI. This is possible if the client can predict an Optimistic Response for the mutation.

Apollo Client gives you a way to specify the `optimisticResponse` option, that will be used to update active queries immediately, in the same way that the server's mutation response will. Once the actual mutation response returns, the optimistic part will be thrown away and replaced with the real result:

```javascript
import { Component } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const submitComment = gql`
  mutation submitComment($repoFullName: String!, $commentContent: String!) {
    submitComment(repoFullName: $repoFullName, commentContent: $commentContent) {
      postedBy {
        login
        html_url
      }
      createdAt
      content
    }
  }
`;

@Component({ ... })
class CommentPageComponent {
  currentUser: User;

  constructor(private apollo: Apollo) {}

  submit({ repoFullName, commentContent }) {
    this.apollo.mutate({
      mutation: submitComment,
      variables: { repoFullName, commentContent },
      optimisticResponse: {
        __typename: 'Mutation',
        submitComment: {
          __typename: 'Comment',
          postedBy: this.currentUser,
          createdAt: +new Date,
          content: commentContent,
        },
      },
    }).subscribe();
  }
}
```

For the example above, it is easy to construct an optimistic response, since we know the shape of the new comment and can approximately predict the created date. The optimistic response doesn't have to be exactly correct because it will always will be replaced with the real result from the server, but it should be close enough to make users feel like there is no delay.

As this comment is new and not visible in the UI before the mutation, it won't appear automatically on the screen as a result of the mutation. You can use updateQueries to make it appear in this case (and this is what we do in GitHunt).

### Designing mutation results

When people talk about GraphQL, they often focus on the data fetching side of things, because that's where GraphQL brings the most value. Mutations can be pretty nice if done well, but the principles of designing good mutations, and especially good mutation result types, are not yet well-understood in the open source community. So when you are working with mutations it might often feel like you need to make a lot of application-specific decisions.

In GraphQL, mutations can return any type, and that type can be queried just like a regular GraphQL query. So the question is - what type should a particular mutation return?

In GraphQL itself, there isn't any specification about how this is supposed to work. In most cases, the data available from a mutation result should be the server developer's best guess of the data a client would need to understand what happened on the server. For example, a mutation that creates a new comment on a blog post might return the comment itself. A mutation that reorders an array might need to return the new array.

## Query, Mutation, Subscription services

If you're familiar with the library, you already know the Apollo service. It is a regular Angular service, pretty much the only one you need to use.

The API is straightforward, `query` and `watchQuery` methods for Queries, `mutate` and `subscribe` accordingly for Mutations and Subscriptions. There is more than that but if you don't do anything advanced that's all you really need.

We decided to introduce a new approach of working with GraphQL in Angular.

There are now 3 new APIs: `Query`, `Mutation` and `Subscription`. Each of them allows to define the shape of a result & variables. The only thing you need to do is to set the document property. That’s it, you use it as a regular Angular service.

In this approach GraphQL Documents are first-class citizens, you think about the query, for example, as a main subject.

The best part about the new API is that you don't have to create those services, there's a tool that does it for you. To read more about it, go to "Code Generation" section

### Query

To get started with the new API, let's see how you define queries with it.

You create a service and extend it with a Query class from apollo-angular. Only thing you need to set is a document property:

```javascript
import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';

export interface Post {
  id: string;
  title: string;
  votes: number;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  };
}
export interface Response {
  posts: Post[];
}


@Injectable({
  providedIn: 'root',
})
export class AllPostsGQL extends Query<Response> {
  document = gql`
    query allPosts {
      posts {
        id
        title
        votes
        author {
          id
          firstName
          lastName
        }
      }
    }
  `;
}
```

We have now a ready to use GraphQL Query that takes advantage of Apollo service under the hood.

#### Basic example

```javascript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// import a service
import { Post, AllPostsGQL } from './graphql';

@Component({...})
export class ListComponent implements OnInit {
  posts: Observable<Post[]>;

  // inject it
  constructor(private allPostsGQL: AllPostsGQL) {}

  ngOnInit() {
    // use it!
    this.posts = this.allPostsGQL.watch()
      .valueChanges
      .pipe(
        map(result => result.data.posts)
      );
  }
}
```

#### Example with variables

```javascript
@Component({...})
export class ListComponent implements OnInit {

  // ...

  ngOnInit() {
    // variables as first argument
    // options as second
    this.posts = this.allPostsGQL.watch({
      first: 10
    }, {
      fetchPolicy: 'network-only'
    })
      .valueChanges
      .pipe(
        map(result => result.data.posts)
      );
  }
}
```

#### API of Query

Query class has two methods:

+ `watch(variables?, options?)` - it's the same as `Apollo.watchQuery` except it accepts `variables` as a first argument and regular `options` as the second one
+ `fetch(variables?, options?)` - same as `Apollo.query`, it fetches data once.

### Mutation

You create a service and extend it with a `Mutation` class from `apollo-angular`. Only thing you need to set is a `document` property:

```javascript
import {Injectable} from '@angular/core';
import {Mutation} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class UpvotePostGQL extends Mutation {
  document = gql`
    mutation upvotePost($postId: Int!) {
      upvotePost(postId: $postId) {
        id
        votes
      }
    }
  `;
}
```

We have now a ready to use GraphQL Mutation.

#### Basic example

```javascript
import {Component, Input} from '@angular/core';
import {UpvotePostGQL} from './graphql';

@Component({
  selector: 'app-upvoter',
  template: `
    <button (click)="upvote()">
      Upvote
    </button>
  `,
})
export class UpvoterComponent {
  @Input()
  postId: number;

  constructor(private upvotePostGQL: UpvotePostGQL) {}

  upvote() {
    this.upvotePostGQL
      .mutate({
        postId: this.postId,
      })
      .subscribe();
  }
}
```

#### API of Mutation

`Mutation` class has only one method:

+ `mutate(variables?, options?)` - it's the same as `Apollo.mutate` except it accepts `variables` as a first argument and regular `options` as the second one.

### Subscription

You create a service and extend it with a `Subscription` class from `apollo-angular`. Only thing you need to set is a `document` property:

```javascript
import {Injectable} from '@angular/core';
import {Subscription} from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class NewPostGQL extends Subscription {
  document = gql`
    subscription newPost {
      newPost {
        id
        title
      }
    }
  `;
}
```

We have now a ready to use GraphQL Subscription.

#### Basic example

```javascript
import {Component, Input} from '@angular/core';
import {NewPostGQL} from './graphql';

@Component({ ... })
export class ActivityComponent {
  constructor(newPostGQL: NewPostGQL) {
    this.lastPost = newPostGQL.subscribe();
  }
}
```

#### API of Subscription

`Subscription` class has only one method:

+ `subscribe(variables?, options?, extraOptions?)` - it's the same as `Apollo.subscribe` except its first argument expect `variables`.

### Code generation

There's a tool to generate a ready to use in your component, strongly typed Angular services, for every defined query, mutation or subscription.

In short, you define a query in `.graphql` file so your IDE gives you autocompletion and validation:

```sh
query allPosts {
  posts {
    id
    title
    votes
    author {
      id
      firstName
      lastName
    }
  }
}
```

Code generation tool outputs to a file, a fully featured service called `AllPostsGQL` with every interface you will need:

```javascript
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// import a service and a type from the generated output
import { Post, AllPostsGQL } from './generated';

@Component({...})
export class ListComponent implements OnInit {
  posts: Observable<Post[]>;

  // inject it
  constructor(private allPostsGQL: AllPostsGQL) {}

  ngOnInit() {
    // use it!
    this.posts = this.allPostsGQL.watch()
      .valueChanges
      .pipe(
        map(result => result.data.posts)
      );
  }
}
```

## Network layer (Apollo link)

Now that you have learned how to read and update your data, it's helpful to know how to direct where your data comes from and where it goes! Apollo has a powerful way to manage your network layer using a library called Apollo Link.

### Apollo Link

Apollo Client has a pluggable network interface layer, which can let you configure how queries are sent over HTTP, or replace the whole network part with something completely custom, like a websocket transport, mocked server data, or anything else you can imagine.

#### Using a link

To create a link to use with Apollo Client, you can install and import one from npm or create your own. We recommend using `apollo-angular-link-http` for most setups!

First, you need to import the appropriate module(s) for each package:

```javascript
import { ApolloModule } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';

@NgModule({
  imports: [
    ApolloModule,
    HttpLinkModule
  ]
})
class AppModule {}
```

Since `HttpLink` uses Angular's `HttpClient` (`@angular/common/http`) internally so it is possible to use it in `NativeScript` or in combination with any other HttpClient provider.

Since the example runs in browser, we are going to use `HttpClientModule` from `@angular/common/http` package:

```javascript
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';

@NgModule({
  imports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
class AppModule {}
```

Since Angular has now access to Apollo related services, here's how you would instantiate a new client with a custom endpoint URL using the HttpLink:

```javascript
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';

@NgModule({
  imports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    const link = httpLink.create({ uri: 'https://example.com/graphql' });

    apollo.create({
      link,
      // other options like cache
    });
  }
}
```

And if you needed to pass additional options to HttpClient:

```javascript
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';

@NgModule({ ... })
class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    const link = httpLink.create({
      uri: 'https://example.com/graphql',
      withCredentials: true,
      method: 'GET'
    });

    apollo.create({
      link,
      // other options like cache
    });
  }
}
```

#### Middleware

Apollo Link is designed from day one to be easy to use middleware on your requests. Middlewares are used to inspect and modify every request made over the `link`, for example, adding authentication tokens to every query. In order to add middleware, you simply create a new link and join it with the `HttpLink`.

The following examples shows how you'd create a middleware. In both examples, we'll show how you would add an authentication token to the HTTP header of the requests being sent by the client:

```javascript
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { ApolloLink, concat } from 'apollo-link';
import { HttpHeaders } from '@angular/common/http';

@NgModule({ ... })
class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    const http = httpLink.create({ uri: '/graphql' });

    const authMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      operation.setContext({
        headers: new HttpHeaders().set('Authorization', localStorage.getItem('token') || null)
      });

      return forward(operation);
    });

    apollo.create({
      link: concat(authMiddleware, http),
    });
  }
}
```

The above example shows the use of a single middleware joined with the HttpLink. It checks to see if we have a token (JWT, for example) and passes that token into the HTTP header of the request, so we can authenticate interactions with GraphQL performed through our network interface.

The following example shows the use of multiple middlewares passed as an array:

```javascript
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { ApolloLink } from 'apollo-link';

@NgModule({ ... })
class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    const http = httpLink.create({ uri: '/graphql' });

    const authMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      // we assume `headers` as a defined instance of HttpHeaders
      operation.setContext(({ headers }) => ({
        headers: headers.append('Authorization', localStorage.getItem('token') || null),
      }));

      return forward(operation);
    })

    const otherMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      // we assume `headers` as a defined instance of HttpHeaders
      operation.setContext(({ headers }) => ({
        headers: headers.append('recent-activity', localStorage.getItem('lastOnlineTime') || null)
      }));

      return forward(operation);
    })

    apollo.create({
      link: from([authMiddleware, otherMiddleware, http]),
    });
  }
}
```

Given the above code, the header's `Authorization` value will be that of `token` and the `recent-activity` value will. This example shows how you can use more than one middleware to make multiple/separate modifications to the request being processed in the form of a chain. This example doesn't show the use of `localStorage`, but is instead just meant to demonstrate the use of more than one middleware using Apollo Link.

#### Afterware

'Afterware' is very similar to a middleware, except that an afterware runs after a request has been made, that is when a response is going to get processed. It's perfect for responding to the situation where a user becomes logged out during their session.

Much like middlewares, Apollo Link was designed to make afterwares easy and powerful to use with Apollo!

The following example demonstrates how to implement an afterware function:

```javascript
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { onError } from 'apollo-link-error'

import { Auth } from './auth';

@NgModule({ ... })
class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink,
    auth: Auth
  ) {
    const http = httpLink.create({ uri: '/graphql' });

    const logoutLink = onError(({ networkError }) => {
      if (networkError.statusCode === 401) auth.logout();
    });

    apollo.create({
      link: logoutLink.concat(http),
    });
  }
}
```

The above example shows the use of `apollo-link-error` to handle network errors from a response. It checks to see if the response status code is equal to 401 and if it is then we will logout the user from the application.

#### Query deduplication

Query deduplication can help reduce the number of queries that are sent over the wire. It is turned on by default, but can be turned off by passing `queryDeduplication: false` to the context on each requests or using the `defaultOptions` key on Apollo Client setup. If turned on, query deduplication happens before the query hits the network layer.

Query deduplication can be useful if many components display the same data, but you don't want to fetch that data from the server many times. It works by comparing a query to all queries currently in flight. If an identical query is currently in flight, the new query will be mapped to the same promise and resolved when the currently in-flight query returns.

### Other links

The network stack of Apollo Client is easily customized using Apollo Link! It can log errors, send side effects, send data over WebSockets or HTTP, and so much more. A few examples are below but make sure to check out the link docs to learn more!

#### GraphQL over WebSocket

Another alternative for network interface is GraphQL over WebSocket, using `subscriptions-transport-ws`.

You can the create WebSocket as full-transport, and pass all GraphQL operations over the WebSocket (`Query`, `Mutation` and `Subscription`), or use a hybrid network interface and execute `Query` and `Mutation` over HTTP, and only Subscription over the WebSocket.

For more information about using WebSocket's with Apollo Link, check out the [guide](https://www.apollographql.com/docs/link/links/ws/)

#### Query Batching

Apollo lets you automatically batch multiple queries into one request when they are made within a certain interval. This means that if you render several components, for example a navbar, sidebar, and content, and each of those do their own GraphQL query, they will all be sent in one roundtrip. Batching works only with server that support batched queries (for example graphql-server). Batched requests to servers that don’t support batching will fail. To learn how to use batching with Apollo check out the [guide](https://github.com/apollographql/apollo-angular/tree/master/packages/apollo-angular-link-http-batch)

## Apollo Cache

### InMemory Cache

`apollo-cache-inmemory` is the default cache implementation for Apollo Client 2.0. `InMemoryCache` is a normalized data store that supports all of Apollo Client 1.0's features without the dependency on Redux.

In some instances, you may need to manipulate the cache directly, such as updating the store after a mutation. We'll cover some common use cases here.

#### Installation

```sh
$ npm install apollo-cache-inmemory --save
```

After installing the package, you'll want to initialize the cache constructor. Then, you can pass in your newly created cache to ApolloClient:

```javascript
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';

@NgModule({ ... })
class AppModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    const cache = new InMemoryCache();

    apollo.create({
      link: httpLink.create(),
      cache
    });
  }
}
```

#### Configuration

The `InMemoryCache` constructor takes an optional config object with properties to customize your cache:

+ addTypename: A boolean to determine whether to add __typename to the document (default: `true`)
dataIdFromObject: A function that takes a data object and returns a unique identifier to be used when normalizing the data in the store. Learn more about how to customize `dataIdFromObject` in the Normalization section.
+ fragmentMatcher: By default, the `InMemoryCache` uses a heuristic fragment matcher. If you are using fragments on unions and interfaces, you will need to use an `IntrospectionFragmentMatcher`. For more information, please read [our guide to setting up fragment matching for unions & interfaces].
+ cacheRedirects (previously known as cacheResolvers or customResolvers): A map of custom ways to resolve data from other parts of the cache.

#### Normalization

The `InMemoryCache` normalizes your data before saving it to the store by splitting the result into individual objects, creating a unique identifier for each object, and storing those objects in a flattened data structure. By default, `InMemoryCache` will attempt to use the commonly found primary keys of `id` and `_id` for the unique identifier if they exist along with `__typename` on an object.

If `id` and `_id` are not specified, or if `__typename` is not specified, `InMemoryCache` will fall back to the path to the object in the query, such as `ROOT_QUERY.allPeople.0` for the first record returned on the `allPeople` root query.

This "getter" behavior for unique identifiers can be configured manually via the `dataIdFromObject` option passed to the `InMemoryCache` constructor, so you can pick which field is used if some of your data follows unorthodox primary key conventions.

For example, if you wanted to key off of the `key` field for all of your data, you could configure `dataIdFromObject` like so:

```javascript
const cache = new InMemoryCache({
  dataIdFromObject: object => object.key
});
```

This also allows you to use different unique identifiers for different data types by keying off of the `__typename` property attached to every object typed by GraphQL. For example:

```javascript
const cache = new InMemoryCache({
  dataIdFromObject: object => {
    switch (object.__typename) {
      case 'foo': return object.key; // use `key` as the primary key
      case 'bar': return object.blah; // use `blah` as the priamry key
      default: return object.id || object._id; // fall back to `id` and `_id` for all other types
    }
  }
});
```

### Direct Cache Access

To interact directly with your cache, you can use the Apollo Client class methods readQuery, readFragment, writeQuery, and writeFragment. These methods are available to us via the `DataProxy` interface. An instance of ApolloClient can be accessed by `getClient()` method of `Apollo` Service.

Any code demonstration in the following sections will assume that we have already initialized an instance of `ApolloClient` and that we have imported the `gql` tag from `graphql-tag`.

#### readQuery

The `readQuery` method is very similar to the `query` method on `ApolloClient` except that `readQuery` will never make a request to your GraphQL server. The query method, on the other hand, may send a request to your server if the appropriate data is not in your cache whereas `readQuery` will throw an error if the data is not in your cache. `readQuery` will always read from the cache. You can use `readQuery` by giving it a GraphQL query like so:

```javascript
@Component({ ... })
class AppComponent {
  constructor(apollo: Apollo) {
    const { todo } = apollo.getClient().readQuery({
      query: gql`
        query ReadTodo {
          todo(id: 5) {
            id
            text
            completed
          }
        }
      `,
    });
  }
}
```

If all of the data needed to fulfill this read is in Apollo Client’s normalized data cache then a data object will be returned in the shape of the query you wanted to read. If not all of the data needed to fulfill this read is in Apollo Client’s cache then an error will be thrown instead, so make sure to only read data that you know you have!

You can also pass variables into `readQuery`:

```javascript
@Component({ ... })
class AppComponent {
  constructor(apollo: Apollo) {
    const { todo } = apollo.getClient().readQuery({
      query: gql`
        query ReadTodo($id: Int!) {
          todo(id: $id) {
            id
            text
            completed
          }
        }
      `,
      variables: {
        id: 5,
      },
    });
  }
}
```

#### readFragment

This method allows you great flexibility around the data in your cache. Whereas `readQuery` only allowed you to read data from your root query type, `readFragment` allows you to read data from any node you have queried. This is incredibly powerful. You use this method as follows:

```javascript
@Component({ ... })
class AppComponent {
  constructor(apollo: Apollo) {
    const todo = apollo.getClient().readFragment({
      id: ..., // `id` is any id that could be returned by `dataIdFromObject`.
      fragment: gql`
        fragment myTodo on Todo {
          id
          text
          completed
        }
      `,
    });
  }
}
```

The first argument is the `id` of the data you want to read from the cache. That id must be a value that was returned by the `dataIdFromObject` function you defined when initializing `ApolloClient`. So for example if you initialized `ApolloClient` like so:

```javascript
@NgModule({ ... })
class AppModule {
  constructor(apollo: Apollo) {
    apollo.create({
      ..., // other options
      dataIdFromObject: object => object.id,
    });
  }
}
```

...and you requested a todo before with an id of 5, then you can read that todo out of your cache with the following:

```javascript
@Component({ ... })
class AppComponent {
  constructor(apollo: Apollo) {
    const todo = apollo.getClient().readFragment({
      id: '5',
      fragment: gql`
        fragment myTodo on Todo {
          id
          text
          completed
        }
      `,
    });
  }
}
```

Note: Most people add a `__typename` to the `id` in `dataIdFromObject`. If you do this then don’t forget to add the `__typename` when you are reading a fragment as well. So for example your `id` may be `Todo_5` and not just `5`.

If a todo with that id does not exist in the cache you will get null back. If a todo of that id does exist in the cache, but that todo does not have the text field then an error will be thrown.

The beauty of `readFragment` is that the todo could have come from anywhere! The todo could have been selected as a singleton ({ todo(id: 5) { ... } }), the todo could have come from a list of todos ({ todos { ... } }), or the todo could have come from a mutation (mutation { createTodo { ... } }). As long as at some point your GraphQL server gave you a todo with the provided id and fields id, text, and completed you can read it from the cache at any part of your code.

#### writeQueryandwriteFragment

Not only can you read arbitrary data from the Apollo Client cache, but you can also write any data that you would like to the cache. The methods you use to do this are `writeQuery` and `writeFragment`. They will allow you to change data in your local cache, but it is important to remember that they will not change any data on your server. If you reload your environment then changes made with `writeQuery` and `writeFragment` will disappear.

These methods have the same signature as their `readQuery` and `readFragment` counterparts except they also require an additional data variable. So for example, if you wanted to update the completed flag locally for your todo with id '5' you could execute the following:

```javascript
Not only can you read arbitrary data from the Apollo Client cache, but you can also write any data that you would like to the cache. The methods you use to do this are writeQuery and writeFragment. They will allow you to change data in your local cache, but it is important to remember that they will not change any data on your server. If you reload your environment then changes made with writeQuery and writeFragment will disappear.

These methods have the same signature as their readQuery and readFragment counterparts except they also require an additional data variable. So for example, if you wanted to update the completed flag locally for your todo with id '5' you could execute the following:

```javascript
@Component({ ... })
class AppComponent {
  constructor(apollo: Apollo) {
    apollo.getClient().writeFragment({
      id: '5',
      fragment: gql`
        fragment myTodo on Todo {
          completed
        }
      `,
      data: {
        completed: true,
      },
    });
  }
}
```

Any subscriber to the Apollo Client store will instantly see this update and render new UI accordingly.

Note: Again, remember that using `writeQuery` or `writeFragment` only changes data locally. If you reload your environment then changes made with these methods will no longer exist.

Or if you wanted to add a new todo to a list fetched from the server, you could use `readQuery` and `writeQuery` together.

```javascript
const query = gql`
  query MyTodoAppQuery {
    todos {
      id
      text
      completed
    }
  }
`;

@Component({ ... })
class AppComponent {
  constructor(apollo: Apollo) {
    const data = apollo.getClient().readQuery({ query });

    const myNewTodo = {
      id: '6',
      text: 'Start using Apollo Client.',
      completed: false,
    };

    apollo.getClient().writeQuery({
      query,
      data: {
        todos: [...data.todos, myNewTodo],
      },
    });
  }
}
```

### Recipes

Here are some common situations where you would need to access the cache directly. If you're manipulating the cache in an interesting way and would like your example to be featured, please send in a pull request!

#### Server side rendering

If you would like to learn more about server side rendering, please check out more in depth guide [here](https://www.apollographql.com/docs/angular/recipes/server-side-rendering/).

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
