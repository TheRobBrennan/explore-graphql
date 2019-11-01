const { RESTDataSource } = require('apollo-datasource-rest');

class LaunchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.spacexdata.com/v2/';
  }

  // According to our schema, we'll need a method to get all of the launches
  async getAllLaunches() {
    // Our RESTDataSource has a helper method for get that will GET https://api.spacexdata.com/v2/launches
    const response = await this.get('launches');
    return Array.isArray(response)
      ? response.map(launch => this.launchReducer(launch))
      : [];
  }

  /*
    Now, we need to write our launchReducer method in order to transform our launch data into the shape our schema expects. We recommend this approach in order to decouple your graph API from business logic specific to your REST API.

    First, let's recall what our Launch type looks like in our schema - start/server/src/schema.js
      type Launch {
        id: ID!
        site: String
        mission: Mission
        rocket: Rocket
        isBooked: Boolean!
      }

    This allows us to easily make changes to the launchReducer method while the getAllLaunches method stays lean and concise.
  */
  launchReducer(launch) {
    return {
      id: launch.flight_number || 0,
      cursor: `${launch.launch_date_unix}`,
      site: launch.launch_site && launch.launch_site.site_name,
      mission: {
        name: launch.mission_name,
        missionPatchSmall: launch.links.mission_patch_small,
        missionPatchLarge: launch.links.mission_patch,
      },
      rocket: {
        id: launch.rocket.rocket_id,
        name: launch.rocket.rocket_name,
        type: launch.rocket.rocket_type,
      },
    };
  }

  async getLaunchById({ launchId }) {
    const response = await this.get('launches', { flight_number: launchId });
    return this.launchReducer(response[0]);
  }

  getLaunchesByIds({ launchIds }) {
    return Promise.all(
      launchIds.map(launchId => this.getLaunchById({ launchId }))
    );
  }
}

module.exports = LaunchAPI;
