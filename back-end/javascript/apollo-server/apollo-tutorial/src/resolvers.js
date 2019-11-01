const { paginateResults } = require('./utils');

/**
 * REMEMBER: Resolver functions accept the following arguments:
 *
 * fieldName: (parent, args, context, info) => data;
 *  parent: An object that contains the result returned from the resolver on the parent type
 *  args: An object that contains the arguments passed to the field
 *  context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 *  info: Information about the execution state of the operation which should only be used in advanced cases
 */
module.exports = {
  /**
   * Resolvers for Query fields identified in start/server/src/schema.js
   *
   * The first argument to our top-level resolvers, parent, is always blank because it refers to the root of our graph.
   * The second argument refers to any arguments passed into our query, which we use in our launch query to fetch a launch by its id.
   * Finally, we destructure our data sources from the third argument, context, in order to call them in our resolvers.
   *
   * Our resolvers are simple and concise because the logic is embedded in the LaunchAPI and UserAPI data sources. We recommend keeping your resolvers thin as a best practice, which allows you to safely refactor without worrying about breaking your API.
   */
  Query: {
    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();
      // we want these in reverse chronological order
      allLaunches.reverse();
      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches,
      });
      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        // if the cursor of the end of the paginated results is the same as the
        // last item in _all_ results, then there are no more results after this
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
          : false,
      };
    },

    launch: (_, { id }, { dataSources }) =>
      dataSources.launchAPI.getLaunchById({ launchId: id }),

    me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser(),
  },

  /**
   * You may have noticed that we haven't written resolvers for all our types, yet our queries still run successfully. GraphQL has default resolvers; therefore, we don't have to write a resolver for a field if the parent object has a property with the same name.
   */
  Mission: {
    // make sure the default size is 'large' in case user doesn't specify
    missionPatch: (mission, { size } = { size: 'LARGE' }) => {
      return size === 'SMALL'
        ? mission.missionPatchSmall
        : mission.missionPatchLarge;
    },
  },

  /**
   * Now that we know how to add resolvers on types other than Query and Mission, let's add some more resolvers to the Launch and User types.
   */
  Launch: {
    isBooked: async (launch, _, { dataSources }) =>
      dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id }),
  },

  User: {
    trips: async (_, __, { dataSources }) => {
      // get ids of launches by user
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();

      if (!launchIds.length) return [];

      // look up those launches by their ids
      return (
        dataSources.launchAPI.getLaunchesByIds({
          launchIds,
        }) || []
      );
    },
  },

  /**
   * Mutations
   */
  Mutation: {
    // The login resolver receives an email address and returns a token if a user exists.
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });
      if (user) return Buffer.from(email).toString('base64');
    },

    bookTrips: async (_, { launchIds }, { dataSources }) => {
      const results = await dataSources.userAPI.bookTrips({ launchIds });
      const launches = await dataSources.launchAPI.getLaunchesByIds({
        launchIds,
      });

      // Must return the properties specified on our TripUpdateResponse type from our schema, which contains a success indicator, a status message, and an array of launches that were booked.
      return {
        success: results && results.length === launchIds.length,
        message:
          results.length === launchIds.length
            ? 'trips booked successfully'
            : `the following launches couldn't be booked: ${launchIds.filter(
                id => !results.includes(id)
              )}`,
        launches,
      };
    },

    cancelTrip: async (_, { launchId }, { dataSources }) => {
      const result = await dataSources.userAPI.cancelTrip({ launchId });

      if (!result)
        return {
          success: false,
          message: 'failed to cancel trip',
        };

      const launch = await dataSources.launchAPI.getLaunchById({ launchId });

      // Must return the properties specified on our TripUpdateResponse type from our schema, which contains a success indicator, a status message, and an array of launches that were cancelled.
      return {
        success: true,
        message: 'trip cancelled',
        launches: [launch],
      };
    },
  },
};
