import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import { SimpleStack } from './simple-stack'

export class Stack extends SimpleStack {
  constructor(scope: constructs.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
  }
}
