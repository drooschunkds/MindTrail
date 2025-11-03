import { Octokit } from '@octokit/rest';

const getOctokit = (providerToken: string) => {
  return new Octokit({ auth: providerToken });
};

const parseRepoUrl = (url: string) => {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('Invalid GitHub repository URL');
  return { owner: match[1], repo: match[2] };
};

export const getUserRepos = async (providerToken: string) => {
  const octokit = getOctokit(providerToken);
  const { data } = await octokit.repos.listForAuthenticatedUser({
    sort: 'pushed',
    per_page: 100,
  });
  return data;
};

export const getRepoDetails = async (providerToken: string, repoUrl: string) => {
  const octokit = getOctokit(providerToken);
  const { owner, repo } = parseRepoUrl(repoUrl);

  const [repoRes, commitsRes] = await Promise.all([
    octokit.repos.get({ owner, repo }),
    octokit.repos.listCommits({ owner, repo, per_page: 5 }),
  ]);

  return {
    ...repoRes.data,
    commits: commitsRes.data,
  };
};

export const getLatestCommitInfo = async (providerToken: string, repoUrl: string): Promise<{ repo: string; branch: string; commit: string; } | null> => {
  try {
    const octokit = getOctokit(providerToken);
    const { owner, repo } = parseRepoUrl(repoUrl);

    // 1. Get the default branch
    const { data: repoData } = await octokit.repos.get({ owner, repo });
    const defaultBranch = repoData.default_branch;

    // 2. Get the latest commit on that branch
    const { data: branchData } = await octokit.repos.getBranch({ owner, repo, branch: defaultBranch });
    
    return {
      repo: `${owner}/${repo}`,
      branch: defaultBranch,
      commit: branchData.commit.sha,
    };
  } catch (error) {
    console.error("Error fetching latest commit info:", error);
    return null;
  }
};
