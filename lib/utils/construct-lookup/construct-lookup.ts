import * as cdk from 'aws-cdk-lib'
import { stackFromProfile } from './stack-from-profile'
import { AnyFunction, LastParameter } from './types'

export async function constructLookup<LookupHandler extends AnyFunction>(
  app: cdk.App,
  id: string,
  props: ConstructLookupProps<LookupHandler>,
): Promise<ReturnType<LookupHandler>> {
  const stack = await stackFromProfile(app, props.profile)
  const construct = props.lookupHandler(stack, id, props.lookupProps)

  // the cdk defaults to 'dummy' constructs before doing the actual lookup
  // we need keep the parent stack around until it finally resolves the construct we want
  // this should be once per env as the cdk will cache the values in cdk.context.json
  if (!isDummyLookup(construct)) {
    // Remove the stack so it's not a part of the deployment
    // that way we don't have to specify which stack to deploy if only really doing 1 stack
    app.node.tryRemoveChild(stack.node.id)
  }

  return construct

  function isDummyLookup(construct: any) {
    return JSON.stringify(construct, getCircularReplacer()).includes('DUMMY')
  }

  function getCircularReplacer() {
    const seen = new WeakSet()
    return (key: string, value: any) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return
        }
        seen.add(value)
      }
      return value
    }
  }
}

export interface ConstructLookupProps<LookupHandler extends AnyFunction> {
  profile?: string
  lookupHandler: LookupHandler
  lookupProps: LastParameter<LookupHandler>
}
