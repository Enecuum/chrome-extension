### Versions
- Chrome extension (default)
- 
- Android
- iOS
- 
- Win Electron
- Mac Electron
- Linux Electron
- 
- Web version for browsers
- Mobile web version for browsers
- PWA on Android
- PWA on iOS
- PWA on desktop (mostly like web version)
- Browsers extension (not Chrome)


### NPM Commands
- npm run start - webpack update files
- npm run make - build ./dist folder for production
- npm run test - test
- npm run electron - run electron version on ./dist
- npm run pack - build electron production apps (mac, win, linux) from ./dist to ./desktop
- npm run prod - run simple node server on ./dist
- npm run stop - stop node server
- npm run ci - run ci webhook inside pm2
- npm run "ci stop" - stop ci webhook

- npm outdated

- npx cap add ios/android
- npx cap copy ios/android
- npx cap sync
- npx cap open ios/android
 

### Manifest
- v2 now, will be v3
- There is two manifests files for reasons
- manifest.json - chrome and electron default manifest
- manifest.webmanifest - web and pwa default manifest

### SRC
- server - simple server for ./dist folder 
- popup - index.html only one js file
- background - extension background file
- background.taskHandler - 
- handler - message handler for app

#### Handler will be launched from popup for web version and from background for extension. 

- lockAccount - 
- indexDB - indexed DB key value implementation
- contentScript - 
- user - default user model
- 
- src/ui - react app
- src/ui/Space - background for web version
- src/copied - static files


### Account options
- Mnemonic phrase
- Ledger
- Simple private keys with option to import more old ones

### Memory
- global.userStorage - storage implementation
- global.asyncRequest - 
- global.chrome
- 
- ENQWeb - 
- ENQWeb.Enq -
- ENQWeb.Enq.User -
- ENQWeb.Net -

### Ledger features
 - To correctly sign a transaction through the ledger, you must first calculate the hash of the transaction fields, put this hash in tx.hash, and pass the hash (tx.hash) to the signature

### For build ios
1. brew install autoconf automake
2. 
