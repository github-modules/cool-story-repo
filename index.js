require('dotenv-safe').load()
require('make-promises-safe')
const {GraphQLClient} = require('graphql-request')
const findGitHubToken = require('./lib/find-github-token')
const buildQuery = require('./query')

async function coolStory (repos) {
  const token = findGitHubToken()

  if (!token || !token.length) {
    return Promise.reject(new Error('`GH_TOKEN` env var must be set'))
  }

  if (!repos || !repos.length) {
    return Promise.reject(new Error('First argument must be a GitHub repo or an array of GitHub repos'))
  }

  const client = new GraphQLClient('https://api.github.com/graphql', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  let result = {}

  if (typeof repos === 'string') repos = Array(repos)
  const query = buildQuery(repos)
  result = await client.request(query)

  const keys = Object.keys(result)

  // if only one repo, return repo object
  if (keys.length === 1) return cleanUp(result[keys[0]])

  // otherwise, return an object with repoNames as keys
  return keys.reduce((acc, key) => {
    const repoName = key.replace('___', '/')
    cleanUp(result[key])
    acc[repoName] = result[key]
    return acc
  }, {})
}

function cleanUp (repoObj) {
  // clean up package.json
  if (repoObj.object && repoObj.object.text) {
    repoObj.packageJSON = JSON.parse(repoObj.object.text)
    delete repoObj.object
  }

  // clean up releases
  if (repoObj.releases && repoObj.releases.edges) {
    repoObj.releases = repoObj.releases.edges.map(edge => {
      const release = edge.node
      if (release.releaseAssets) {
        release.assets = release.releaseAssets.edges.map(edge => edge.node)
      }
      return release
    })
  }

  repoObj._fetchedAt = new Date()

  return repoObj
}

module.exports = coolStory
