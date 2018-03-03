const repoProps = `forks_url
keys_url
collaborators_url
teams_url
hooks_url
issue_events_url
events_url
assignees_url
branches_url
tags_url
blobs_url
git_tags_url
git_refs_url
trees_url
statuses_url
languages_url
stargazers_url
contributors_url
subscribers_url
subscription_url
commits_url
git_commits_url
comments_url
issue_comment_url
contents_url
compare_url
merges_url
archive_url
downloads_url
issues_url
pulls_url
milestones_url
notifications_url
labels_url
releases_url
deployments_url`.split('\n')

const orgProps = `followers_url
following_url
gists_url
starred_url
subscriptions_url
organizations_url
repos_url
events_url
received_events_url`.split('\n')

module.exports = repoProps.concat(orgProps)