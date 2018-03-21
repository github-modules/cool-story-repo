module.exports = function findGitHubToken () {
  return process.env.GH_API_KEY ||
    process.env.GH_API_TOKEN ||
    process.env.GH_KEY ||
    process.env.GH_TOKEN ||
    process.env.GITHUB_API_KEY ||
    process.env.GITHUB_API_TOKEN ||
    process.env.GITHUB_KEY ||
    process.env.GITHUB_TOKEN
}
