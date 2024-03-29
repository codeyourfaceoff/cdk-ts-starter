import { SdkProvider, Mode } from 'aws-cdk/lib/api'

export async function loadCredentialsFromProfile(
  profile: string = process.env.AWS_SDK_PROFILE! ||
    process.env.AWS_PROFILE ||
    process.env.AWS_DEFAULT_PROFILE ||
    'default',
) {
  const sdk = await SdkProvider.withAwsCliCompatibleDefaults({
    profile,
  })

  const credentials = await getCredentialsConfig(sdk, profile)

  return credentials
}

export async function getCredentialsConfig(sdk: SdkProvider, profile: string) {
  const region = sdk.defaultRegion
  const defaultAccount = await sdk.defaultAccount()
  const credentials = await sdk.forEnvironment(
    {
      account: defaultAccount!.accountId,
      region: region,
      name: profile,
    },
    Mode.ForReading,
  )

  return {
    account: defaultAccount,
    region,
    credentials,
  }
}
