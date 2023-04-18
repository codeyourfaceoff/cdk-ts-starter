#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { Stack } from '../lib/stack'

const main = async () => {
  const app = new cdk.App()

  console.warn('Using stackName "Stack", you may want to change that.')
  const stack = new Stack(app, 'Stack', {
    /* If you don't specify 'env', this stack will be environment-agnostic.
     * Account/Region-dependent features and context lookups will not work,
     * but a single synthesized template can be deployed anywhere. */
    /* Uncomment the next line to specialize this stack for the AWS Account
     * and Region that are implied by the current CLI configuration. */
    // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to. */
    // env: { account: '123456789012', region: 'us-east-1' },
    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  })
}
main()

// Example of using w/ constructLookup util
// =====================================
// const main = async () => {
//   const sqsQueue = await constructLookup(app, 'sqs', {
//     lookupHandler: cdk.aws_sqs.Queue.fromQueueArn,
//     lookupProps: 'arn:aws:sqs:us-west-2::SomeStackName',
//   })
//   new Stack(app, 'Stack', {
//     queue: sqsQueue,
//   })
// }
// main()
