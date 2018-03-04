# 😎 cool-story-repo 

> Find out a lot about a GitHub repo using a single request to GitHub's GraphQL API

Included so far:

- basic repo metadata
- master branch's `package.json` data

Wishlist:

- Release data
- Contributor data
- SHA of the very first commit to the repo, for finding forks that dissociated from their origin repo.

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

`process.env.GH_TOKEN` is required and should have "repo" scope.
Need a token? [Get one here.](https://github.com/settings/tokens/new).

## API

### `coolStory(repoName)`

- `repoName` - A required string in `owner/repo` format.

Returns a Promise that resolves to a key-value repository Object.

## Tests

```sh
npm install
npm test
```

## License

MIT
