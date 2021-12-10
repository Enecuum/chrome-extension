- npm run start - webpack update files
- npm run make - build ./dist folder for production
- npm run test - test
- npm run electron - run electron version on ./dist
- npm run pack - build electron production apps (mac, win) from ./dist to ./desktop
- npm run prod - run simple node server on ./dist
- npm run stop - stop node server
- npm run ci - run ci webhook inside pm2
- npm run "ci stop" - stop ci webhook

There is two manifests files for some reasons

- server - simple server for ./dist folder 
- popup - index.html only one js file
- background - extension (manifest v2) background file
- handler - messages handler for web app
- contentScript - 


- disk - storage implementation


- src.ui - react app
- src.copied - static files