const {GraphQLClient} = require('graphql-request')

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

  const [owner, repo] = (repoFullName || '').split('/')
  
  if (!owner || !repo) {
    return Promise.reject(new Error('First argument must be a GitHub repo in `owner/repo` format'))
  }

  const client = new GraphQLClient('https://api.github.com/graphql', {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  
  const query = `{
    repository(owner: "${owner}", name: "${repo}") {
      nameWithOwner
      description
      descriptionHTML
      homepageUrl
      isFork
      forkCount
      licenseInfo {
        name
      }
      createdAt
      pushedAt
    }
  }`

  let result = {}
  
  try {
    const {repository} = await client.request(query)
    Object.assign(result, repository)
  } catch (err) {
    return Promise.reject(err)
  }
  
  return result
}

module.exports = coolStory