# Job Search PWA - Built with Stencil

There comes a time in every software engineers life when he has to go out looking for jobs. When this happened to me, I created this app to open source my job search so my friends and family can stay up to date on the process, and provide me with valuable feedback on jobs that I have applied / interviewed for. 

If you want to use this tool, feel free to fork this repo. I have created a sample database file (sample-jobs.json) that you can import into your firebase instance.

Hopefully this will bring you as much luck as it has brought me!

![Job Search Preview](job-search-preview.png?raw=true "Job Search")

## Ionic PWA Tookit

I used the Ionic PWA Toolkit as a starter for this project. The Ionic PWA Toolkit is the recommended way to build production ready Progressive Web Apps (PWAs) with Ionic. This toolkit gets you started with [Stencil](https://stenciljs.com/) and an early release of Ionic (4.x+). This combination of tools gives you the ability to build a fast, efficient PWA with zero config needed and best practices out of the box.

## Features Included in the Job Search PWA

- Stencil for easily building and loading standardized Web Components
- Ionic Framework
- Firebase Hosting
- Firebase Authentication
- [Firebase Realtime Database Integration](https://www.pwatoday.com/post/integrating-firebase-with-a-stencil-built-pwa)
- [Global Sass Variables](https://www.pwatoday.com/post/global-css-sass-variables-with-stencil)
- Push Notifications setup (In Development)
- Showing a toast when a new version of the PWA is available (In Development)
- Unit Tests
- Everything needed for an add to homescreen PWA (service worker, web manifest and iOS meta tags)

## Getting Started

fork this repo, downlod it locally and run:

```bash
npm install
npm start
```

You will need to add your own firebase configuration file. the file should be ```src/helpers/config.ts``` and look something like this.

```js
export var firebaseConfig = {
    apiKey: <api-key>,
    authDomain: <auth-domain>,
    databaseURL: <database-url>,
    projectId: <project-id>,
    storageBucket: <storage-bucket>,
    messagingSenderId: <messaging-sender-id>
}
```

## Production

To build your PWA for production, run:

```bash
npm run build
```
The build is preconfigured for --es5 options, to enable support for iOS 10.x devices

## Service Workers

For info on how Service Workers work in Stencil check out the stencil service workers blog. In ours, we have service workers doing push notifications in the background. [Service Worker docs](https://stenciljs.com/docs/service-workers).

## Unit Tests

To run the unit tests once, run:

```
npm test
```

To run the unit tests and watch for file changes during development, run:

```
npm run test.watch
```

