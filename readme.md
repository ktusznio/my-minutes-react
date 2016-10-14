# My Minutes

An implementation of My Minutes in React and Redux.

## Running

1. Install dependencies: `npm install`
2. Install typings: `typings install`
3. Create config.ts: `cp config.sample.ts config.ts` and fill in required values.
3. Start dev server: `npm start`
4. Open <localhost:8080>

## Deploying

```
npm install -g firebase-tools
npm run-script build:beta
firebase use beta
firebase deploy
firebase use development # switch back to development
```
