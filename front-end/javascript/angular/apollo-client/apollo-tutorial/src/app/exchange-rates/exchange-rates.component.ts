import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, Subscription } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { ExchangeRate, ExchangeRatesQuery } from './exchange-rates';

@Component({
  selector: 'app-exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.css']
})
export class ExchangeRatesComponent implements OnInit, OnDestroy {
  // Use ngOnInit to pipe values to these Observables
  rates$: Observable<ExchangeRate[]>;
  loading$: Observable<boolean>;
  errors$: Observable<any>;

  // Use ngOnInit to subscribe to a query and populate values
  // IMPORTANT: Remember to unsubscribe in ngOnDestroy to prevent memory leaks 😁
  private querySubscription: Subscription;
  loading: boolean;
  errors: any;
  rates: ExchangeRate[];

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    const query = gql`
      {
        rates(currency: "USD") {
          currency
          rate
        }
      }
    `;

    /**
     * Original example - Pipe valueChanges to our Observables
     */
    // The watchQuery method returns a QueryRef object which has the valueChanges property that is an Observable
    const source$ = this.apollo.watchQuery<ExchangeRatesQuery>({query})
      .valueChanges
      .pipe(shareReplay(1));

    // Pipe source$ to our Observables
    this.rates$ = source$.pipe(map(result => result.data && result.data.rates));
    this.loading$ = source$.pipe(map(result => result.loading));
    this.errors$ = source$.pipe(map(result => result.errors));

    /**
     * Second example - This uses a query subscription to the valueChanges Observable.
     * The Observable will only emit a response object - containing loading, errors, and data -
     * once the query has completed.
     */
    // The watchQuery method returns a QueryRef object which has the valueChanges property that is an Observable
    this.querySubscription = this.apollo.watchQuery<ExchangeRatesQuery>({query})
      .valueChanges
      .subscribe(({ loading, errors, data }) => {
        this.loading = loading;
        this.errors = errors;
        // We can expect the data.rates to change over time. That information is stored in
        // Apollo Client's global cache, so if some other query fetches new information about
        // the current rates, this component will update to remain consistent.
        this.rates = data && data.rates;
      });

  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
