import { Mode } from 'aws-cdk/lib/api/aws-auth/credentials';
import { SdkProvider } from 'aws-cdk/lib/api/aws-auth/sdk-provider';

export async function loadCredentialsFromProfile(
  profile: string = process.env.AWS_SDK_PROFILE!
) {
  const sdk = await SdkProvider.withAwsCliCompatibleDefaults({
    profile,
  });

  const credentials = await getCredentialsConfig(sdk, profile);

  return credentials;
}

export async function getCredentialsConfig(sdk: SdkProvider, profile: string) {
  const region = sdk.defaultRegion;
  const defaultAccount = await sdk.defaultAccount();
  const credentials = await sdk.forEnvironment(
    {
      account: defaultAccount!.accountId,
      region: region,
      name: profile,
    },
    Mode.ForReading
  );

  return {
    account: defaultAccount,
    region,
    credentials,
  };
}
