require('dotenv-safe').load()
const {GraphQLClient} = require('graphql-request')
const fs = require('fs')
const path = require('path')
const findGitHubToken = require('./lib/find-github-token')
const buildQuery = require('./query')
const repos = ['zeit/hyper', 'electron/electron']



async function coolStory () {
  const token = findGitHubToken()
  if (!token || !token.length) {
    return Promise.reject(new Error('`GH_TOKEN` env var must be set'))
  }

  const client = new GraphQLClient('https://api.github.com/graphql', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  let result = {}

    try{
      const query = buildQuery(repos)
      console.log('the query returned from buildQUery', query)
      result = await client.request(`query CoolStory{${query}}`)
    }catch(err){
      return Promise.reject(`the promise was super rejected ${err}`)
    }

  //would do both of these in a for in loop of the aggregate results?

  // clean up package.json
  // if (result.object && result.object.text) {
  //   result.packageJSON = JSON.parse(result.object.text)
  //   delete result.object
  // }

  // // clean up releases
  // if (result.releases && result.releases.edges) {
  //   result.releases = result.releases.edges.map(edge => {
  //     const release = edge.node
  //     if (release.releaseAssets) {
  //       release.assets = release.releaseAssets.edges.map(edge => edge.node)
  //     }
  //     return release
  //   })
  // }

  result.fetchedAt = new Date()
  console.log('this is the result', result)
  return result
}

coolStory()

module.exports = coolStory
