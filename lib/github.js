// modrinth-proxy
// Original Copyright (C) 2025-2026 БоБоБо
// Modifications Copyright (C) 2026 Mr712
// Licensed under AGPL-3.0-or-later
const GITHUB_REPO_RE =
  /^https?:\/\/github\.com\/([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+?)(?:\.git)?\/?$/

export function parseGitHubRepoFromSourceUrl(sourceUrl) {
  if (!sourceUrl || typeof sourceUrl !== 'string') return null
  const match = sourceUrl.trim().match(GITHUB_REPO_RE)
  if (!match) return null
  const repo = match[1]
  return {
    repo,
    repoUrl: `https://github.com/${repo}`,
  }
}

export function formatGitHubCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  return String(n)
}

export function pluralRu(count, one, few, many) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod100 >= 11 && mod100 <= 19) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}

export async function fetchGitHubRepoStats(repo) {
  const [repoRes, prRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${repo}`),
    fetch(`https://api.github.com/repos/${repo}/pulls?state=open&per_page=1`),
  ])

  if (!repoRes.ok) return null

  const repoData = await repoRes.json()
  let prCount = 0

  if (prRes.ok) {
    const prData = await prRes.json()
    const link = prRes.headers.get('Link')
    const lastPage = link?.match(/[?&]page=(\d+)>; rel="last"/)
    prCount = lastPage ? parseInt(lastPage[1], 10) : (Array.isArray(prData) ? prData.length : 0)
  }

  return {
    stars: repoData.stargazers_count ?? 0,
    forks: repoData.forks_count ?? 0,
    prs: prCount,
    issues: Math.max(0, (repoData.open_issues_count ?? 0) - prCount),
  }
}
