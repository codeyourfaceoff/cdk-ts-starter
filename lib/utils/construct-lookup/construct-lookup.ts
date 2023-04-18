import * as cdk from "aws-cdk-lib";
import { stackFromProfile } from "./stack-from-profile";
import { AnyFunction, LastParameter } from "./types";

export async function constructLookup<LookupHandler extends AnyFunction>(
  app: cdk.App,
  id: string,
  props: ConstructLookupProps<LookupHandler>
): Promise<ReturnType<LookupHandler>> {
  const stack = await stackFromProfile(app, props.profile);
  const construct = props.lookupHandler(stack, id, props.lookupProps);

  // Remove the stack so it's not a part of the deployment
  app.node.tryRemoveChild(stack.node.id);

  return construct;
}

export interface ConstructLookupProps<LookupHandler extends AnyFunction> {
  profile?: string;
  lookupHandler: LookupHandler;
  lookupProps: LastParameter<LookupHandler>;
}
