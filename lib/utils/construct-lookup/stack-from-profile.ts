import * as cdk from 'aws-cdk-lib'

import { loadCredentialsFromProfile } from './credentials-helpers'

export async function stackFromProfile(app: cdk.App, profile?: string) {
  const credentials = await loadCredentialsFromProfile(profile)
  const stack = new cdk.Stack(
    app,
    `profile-stack-lookup-${credentials.account?.accountId}-${uniqueId()}`,
    {
      env: {
        account: credentials.account!.accountId,
        region: credentials.region,
      },
    },
  )

  return stack
}

function uniqueId() {
  const now = last4Digits(Date.now())
  const rand = last4Digits(Math.random())

  return now + rand

  function last4Digits(value: any) {
    return value.toString().slice(-4)
  }
}
