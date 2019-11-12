import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';
import { ExchangeRate, ExchangeRatesQuery } from './exchange-rates';

@Component({
  selector: 'app-exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.css']
})
export class ExchangeRatesComponent implements OnInit {
  rates$: Observable<ExchangeRate[]>;
  loading$: Observable<boolean>;
  errors$: Observable<any>;

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

    // The watchQuery method returns a QueryRef object which has the valueChanges property that is an Observable
    const source$ = this.apollo.watchQuery<ExchangeRatesQuery>({query})
      .valueChanges
      .pipe(shareReplay(1));

    // Pipe source$ to our Observables
    this.rates$ = source$.pipe(map(result => result.data && result.data.rates));
    this.loading$ = source$.pipe(map(result => result.loading));
    this.errors$ = source$.pipe(map(result => result.errors));
  }
}
