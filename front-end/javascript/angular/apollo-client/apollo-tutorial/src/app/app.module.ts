import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';

// Apollo
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ExchangeRatesComponent } from './exchange-rates/exchange-rates.component';

@NgModule({
  declarations: [AppComponent, ExchangeRatesComponent],
  imports: [
    BrowserModule,
    GraphQLModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: (httpLink: HttpLink) => {
      return {
        // Use the Apollo cache for storing data in memory
        cache: new InMemoryCache(),
        // Connect our client to an external GraphQL server
        link: httpLink.create({
          uri: 'https://o5x5jzoo7z.sse.codesandbox.io/graphql'
        })
      };
    },
    deps: [HttpLink]
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
