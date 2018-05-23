const { GraphQLClient } = require('graphql-request')
const fs = require('fs')
const path = require('path')
const findGitHubToken = require('./lib/find-github-token')
const query = fs.readFileSync(path.join(__dirname, 'query.gql'), 'utf8')

async function coolStory(repoFullName) {
  const token = findGitHubToken()

  if (!token || !token.length) {
    return Promise.reject(new Error('`GH_TOKEN` env var must be set'))
  }

  const [owner, repo] = (repoFullName || '').split('/')

  if (!owner || !repo) {
    return Promise.reject(new Error('First argument must be a GitHub repo in `owner/repo` format'))
  }

  const client = new GraphQLClient('https://api.github.com/graphql', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const variables = { owner, repo }

  let result = {}

  try {
    const { repository } = await client.request(query, variables)
    Object.assign(result, repository)
  } catch (err) {
    return Promise.reject(err)
  }

  // clean up package.json
  if (result.packageJSON && result.packageJSON.text) {
    result.packageJSON = JSON.parse(result.packageJSON.text)
  }

  if (result.appDirPackageJSON && result.appDirPackageJSON.text) {
    result.appDirPackageJSON = JSON.parse(result.appDirPackageJSON.text)
  }

  // clean up releases
  if (result.releases && result.releases.edges) {
    result.releases = result.releases.edges.map(edge => {
      const release = edge.node
      if (release.releaseAssets) {
        release.assets = release.releaseAssets.edges.map(edge => edge.node)
      }
      return release
    })
  }

  result.fetchedAt = new Date()

  return result
}

module.exports = coolStory
