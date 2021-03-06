import { NUM_SUPPORTED_VERSIONS } from '../constants';

import { getEnvVar } from './env-util';
import { Context } from 'probot';

/**
 * Fetches an array of the currently supported branches for a repository
 *
 * @returns string[] - an array of currently supported branches in x-y-z format
 */
// Get array of currently supported branches
export async function getSupportedBranches(context: Context): Promise<string[]> {
  const SUPPORTED_BRANCH_ENV_PATTERN = getEnvVar('SUPPORTED_BRANCH_PATTERN', '^[0-9]+-([0-9]+-x|x-y)$');
  const SUPPORTED_BRANCH_PATTERN = new RegExp(SUPPORTED_BRANCH_ENV_PATTERN);

  const { data: branches } = await context.github.repos.listBranches(context.repo({
    protected: true,
  }));

  const releaseBranches = branches.filter(branch => branch.name.match(SUPPORTED_BRANCH_PATTERN));
  const filtered: Record<string, string> = {};
  releaseBranches.sort().forEach((branch) => {
    return filtered[branch.name.split('-')[0]] = branch.name;
  });

  const values = Object.values(filtered);
  return values.sort().slice(-NUM_SUPPORTED_VERSIONS);
}
