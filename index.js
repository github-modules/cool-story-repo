require('dotenv-safe').load()
require('make-promises-safe')
const {GraphQLClient} = require('graphql-request')
const fs = require('fs')
const path = require('path')
const findGitHubToken = require('./lib/find-github-token')
const buildQuery = require('./query')


async function coolStory (repos) {
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
      //if the incomming repos is a single repo, we assume it'll be a string
      //if so, convert it to an array for buildQuery
      if(typeof repos === 'string') repos = Array(repos)
      const query = buildQuery(repos)
      result = await client.request(query)
      console.log('this is the result', result)
    }catch(err){
      return Promise.reject(`the promise was super rejected ${err}`)
    }

  //iterate through each aliased query and call these on them to clean up
  //npm module for converting graphql to human friendly responses
  //does graphql support renaming nodes

  //function for cleaning up repo data
  //could potentially be generalized, turn nodes and edges
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

  // result.fetchedAt = new Date()
  const keys = Object.keys(result)
  //if only one repo, return repo object

  //return the result of calling cleanUpRepo on the result
  if(keys.length === 1) return result[keys[0]]
  //return an object with repoNames as keys
  return keys.reduce((acc, key, i) => {
    const repoName = key.replace('___', '/')
    //cleanUpRepo
    acc[repoName] = result[key]
  }, {})
}

coolStory('echjordan/prof_site')

module.exports = coolStory
