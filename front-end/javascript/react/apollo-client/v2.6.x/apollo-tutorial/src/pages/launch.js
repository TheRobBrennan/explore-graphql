import React, { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Loading, Header, LaunchDetail } from '../components';
import { ActionButton } from '../containers';

// Import our fragment (defined in start/client/src/pages/launches.js) for reuse here
import { LAUNCH_TILE_DATA } from './launches';
export const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      isInCart @client
      site
      rocket {
        type
      }
      ...LaunchTile
    }
  }
  ${LAUNCH_TILE_DATA}
`;

export default function Launch({ launchId }) {
  // launchId will come through as a prop from the router
  // Pass in our launchId as a variable to our GraphQL query
  const { data, loading, error } = useQuery(GET_LAUNCH_DETAILS, {
    variables: { launchId },
  });
  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;

  return (
    <Fragment>
      <Header image={data.launch.mission.missionPatch}>
        {data.launch.mission.name}
      </Header>
      <LaunchDetail {...data.launch} />
      <ActionButton {...data.launch} />
    </Fragment>
  );
}
