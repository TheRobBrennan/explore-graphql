import gql from 'graphql-tag';
import { GET_CART_ITEMS } from './pages/cart';

// Add an `isInCart` virtual field to our `Launch` type.
export const schema = gql`
  extend type Launch {
    isInCart: Boolean!
  }
`;

/**
 * To build a client schema, we extend the types of our server schema and wrap it with the gql function. Using the extend keyword allows us to combine both schemas inside developer tooling like Apollo VSCode and Apollo DevTools.
 */
export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }

  extend type Launch {
    isInCart: Boolean!
  }

  extend type Mutation {
    addOrRemoveFromCart(id: ID!): [Launch]
  }
`;

export const resolvers = {
  Launch: {
    // Specify a client resolver to tell Apollo Client how to resolve your virtual field on the Launch type
    isInCart: (launch, _, { cache }) => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
      return cartItems.includes(launch.id);
    },
  },
  Mutation: {
    /**
     * In this resolver, we destructure the Apollo cache from the context in order to read the query that fetches cart items. Once we have our cart data, we either remove or add the cart item's id passed into the mutation to the list. Finally, we return the updated list from the mutation.
     */
    addOrRemoveFromCart: (_, { id }, { cache }) => {
      const { cartItems } = cache.readQuery({ query: GET_CART_ITEMS });
      const data = {
        cartItems: cartItems.includes(id)
          ? cartItems.filter(i => i !== id)
          : [...cartItems, id],
      };
      cache.writeQuery({ query: GET_CART_ITEMS, data });
      return data.cartItems;
    },
  },
};
