import * as cdk from 'aws-cdk-lib'

import { loadCredentialsFromProfile } from './credentials-helpers'

export async function stackFromProfile(profile: string, app: cdk.App) {
  const credentials = await loadCredentialsFromProfile(profile);
  const stack = new cdk.Stack(app, `profile-stack-lookup-${profile}`, {
    env: {
      account: credentials.account!.accountId,
      region: credentials.region,
    },
  });

  return stack;
}
