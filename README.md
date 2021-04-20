# Records App

[see it live](https://eager-liskov-b6456d.netlify.app/)

This is a React app that pulls record album data. Records are presented to the user and various attributes on each item may be updated. The app leverages various other technologies and libraries:

- [TypeScript](https://www.typescriptlang.org/)
- [Grommet React UI Framework](https://v2.grommet.io/)
- [React Query](https://react-query.tanstack.com/) for fetching, caching and syncing data
- [PWA](https://web.dev/progressive-web-apps/)/ServiceWorker based caching
- [contentEditable](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable) elements vs inputs

The API data for this app is hosted via github gists and thus mutations are inherently not supported. Functionality available through the React Query api with a localStorage-based "backend" is used to simulate persisted updates to data once has been fetched for the first time. Paginated data is fetched lazily once scolling towards the end of the currently displayed records.

The original data includes an ID field for the Artist but not for the Record resource. Since functionality is built in for updating as described above, maintaining a unique identifier based on any combination of data is not reliable. Since subsequent fetches for the api are served from a local query cache, unique identifieres are generated and the response data is transformed to incude these ids when returned from the remote source.

To make UI more interesting, art is displayed for each item. Since the data values that represent real artists but fake data for titles, only the artist sourced to fetch album art via the [album-art](https://www.npmjs.com/package/album-art) package that uses the Spotify api under-the-hood. This means that any two records with the same artist will have the same art (and updating the artist on one will change the image on all items with that artist).

## Development

Pull the repo and run `yarn` to install the dependencies. Run `yarn start` to run the local dev server and open up a browser to view the app. In dev mode you will find the React Query dev tools by clicking the RQ icon on the left bottom corner of the screen.

## TODO:

- (integration) specs
-
