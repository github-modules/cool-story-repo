let owner, repo

function buildQuery(arrOfRepos){
  return arrOfRepos.reduce((completeQuery,repo, i) => {
    [owner, repo] = (repoFullName || '').split('/')
    if (!owner || !repo) {
      return Promise.reject(new Error('First argument must be a GitHub repo in `owner/repo` format'))
    }
    completeQuery.concat(`repo${i}:${query}`)
    })
    console.log('this is the complete query', completeQuery)
    return completeQuery
}

const query = `repository(owner: ${owner}, name: ${repo}) {
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

    # package.json
    object(expression: "master:package.json") {
      ... on Blob {
        text
      }
    }

    # releases
    releases(first: 5, orderBy:{field:CREATED_AT, direction:DESC}) {
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
          releaseAssets(first: 100) {
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

    #collaborators
     collaborators(affiliation: DIRECT, first: 100){
        nodes{
          name
          avatarUrl
          bio
          company
          contributedRepositories(first:100){
            nodes{
              nameWithOwner
            }
          }
        }
      }

  }`


module.exports = buildQuery
