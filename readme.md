# 😎 cool story, repo

> Find out a lot about a GitHub repository with a single request to GitHub's GraphQL API

Included so far:

- basic repo metadata
- 5 most recent releases
- `package.json` data from master branch

And a [wishlist](https://github.com/nice-registry/cool-story-repo/issues) of things to come.

## Installation

Works in Node `>=7`. Not currently suitable for use in browsers.

```sh
npm install cool-story-repo
```

## Usage

```js
const coolStory = require('cool-story-repo')

coolStory('electron/electron').then(repo => {
  console.log(repo)
})
```
coolStory can also optionally accept an array of repos.

```js
const coolStory = require('cool-story-repo')

coolStory(['electron/electron', 'zeit/hyper']).then(repos => {
  console.log(repos)
})
```

Unlike github's REST API, the github GraphQL API requires authentication for all requests. `process.env.GH_TOKEN` is required and should have "repo" scope.
Need a token? [Get one here.](https://github.com/settings/tokens/new).

## API

### `coolStory(repoName)`

- `repoName` - A required string or array of strings in `owner/repo` format.

Returns a Promise that resolves to a key-value repository Object or an array of repository Objects.

## Tests

```sh
npm install
npm test
```

## License

MIT
