const GitHub = require('@octokit/rest')
const {omit} = require('lodash')
const undesireableProps = require('./lib/undesireable-props')

async function coolStory (repoFullName) {
  const token = process.env.GH_API_KEY ||
      process.env.GH_API_TOKEN ||
      process.env.GH_KEY ||
      process.env.GH_TOKEN ||
      process.env.GITHUB_API_KEY ||
      process.env.GITHUB_API_TOKEN ||
      process.env.GITHUB_KEY ||
      process.env.GITHUB_TOKEN

  if (!token || !token.length) {
    return Promise.reject(new Error('`GH_TOKEN` env var must be set'))
  }

  const github = GitHub()
  github.authenticate({type: 'token', token: token})

  const [owner, repo] = (repoFullName || '').split('/')
  
  if (!owner || !repo) {
    return Promise.reject(new Error('First argument must be a GitHub repo in `owner/repo` format'))
  }

  let result = {}
  
  try {
    const {data} = await github.repos.get({owner, repo})
    
    // remove useless props like `issue_events_url`
    Object.assign(result, omit(data, undesireableProps))
  } catch (err) {
    return Promise.reject(new Error(JSON.parse(err.message).message))
  }

  // try {
  //   result = await github.repos.get({owner, repo})  
  // } catch (e) {
  //   // oh well
  // }
  
  return result
}

module.exports = coolStory