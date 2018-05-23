function buildQuery (arrOfRepos) {
  const allSubqueries = arrOfRepos.map((repoName) => {
    let [owner, repo] = (repoName || '').split('/')
    if (!owner || !repo) {
      throw new Error('First argument must be a GitHub repo in `owner/repo` format')
    }
    const query = `repository(owner: "${owner}", name: "${repo}") {
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
        object(expression: "master:package.json") {
          ... on Blob {
            text
          }
        }
        releases(first: 5, orderBy: {field: CREATED_AT, direction: DESC}) {
          edges {
            node {
              name
              createdAt
              isDraft
              isPrerelease
              publishedAt
              tag {
                name
              }
              assets:releaseAssets(first: 100) {
                edges {
                  node {
                    name
                    downloadCount
                    downloadUrl
                    size
                  }
                }
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }`

    // replaces - with _ for aliases because graphQL doesnt like -
    if (owner.includes('-')) owner = owner.replace(/-/g, '_')
    if (repo.includes('-')) repo = repo.replace(/-/g, '_')
    return `${owner}___${repo}:${query}`
  })
  return `query CoolStory{${allSubqueries.join('\n\n')}}`
}

module.exports = buildQuery
