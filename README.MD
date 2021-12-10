### Versions
- Chrome extension (default)
- Browsers extension
---
- Web version for browsers
- Mobile web version for browsers
- PWA on desktop (mostly like web version)
- PWA on Android
- PWA on iOS
---
- Electron (Win, Mac)

### NPM Commands
- npm run start - webpack update files
- npm run make - build ./dist folder for production
- npm run test - test
- npm run electron - run electron version on ./dist
- npm run pack - build electron production apps (mac, win) from ./dist to ./desktop
- npm run prod - run simple node server on ./dist
- npm run stop - stop node server
- npm run ci - run ci webhook inside pm2
- npm run "ci stop" - stop ci webhook

### Manifest
- v2 now, will be v3
- There is two manifests files for reasons
- manifest.json - electron default manifest
- manifest.webmanifest - web and pwa default manifest

### SRC
- server - simple server for ./dist folder 
- popup - index.html only one js file
- background - extension background file
- handler - message handler for app

Handler launched from popup version for web version and from background for extension 

- contentScript - 


- global.disk - storage implementation
- ENQWeb - 
- ENQWeb.Enq -
- ENQWeb.Enq.User -
- ENQWeb.Net - 


- src.ui - react app
- src.copied - static files