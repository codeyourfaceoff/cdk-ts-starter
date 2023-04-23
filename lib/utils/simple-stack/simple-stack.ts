// This file's intent is to remove the unique ids aws-cdk generates by default
// Only use this if you want to manage the uniqueness of constructs yourself as there is high probability of collision now
// It's basically a copy of https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/core/lib/stack.ts and https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/core/lib/private/uniqueid.ts without the hashing part
// BE CAREFUL!!!!

import {
  CfnElement,
  CfnOutput,
  ExportValueOptions,
  Fn,
  Reference,
  Stack,
  Token,
  Tokenization,
  FeatureFlags,
  Annotations,
  Duration,
} from 'aws-cdk-lib'
import { SelfDestruct } from 'cdk-self-destruct'
import { Construct, IConstruct } from 'constructs'
import * as cxapi from 'aws-cdk-lib/cx-api'
import { makeUniqueId } from './makeUniqueId'
import { referenceNestedStackValueInParent } from '../../../node_modules/aws-cdk-lib/core/lib/private/refs'

/**
 * **BE CAREFUL!!!! DO NOT USE IN PRODUCTION!!!!**
 *
 * This is a simplified version of the [Stack](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/core/lib/stack.ts)
 * class from aws-cdk-lib, this version removes the unique id
 * generation from the stack, this is useful when in development
 * and don't want to deal with auto generated ids from the cdk
 * that can make things noisy and hard when getting started
 *
 * turns: BucketName1234567890 -> BucketName
 *
 * This means you have to manage the uniqueness of constructs yourself
 * otherwise there is high probability of collision
 *
 * It's a copy of [the cdk stack](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/core/lib/stack.ts)
 * and the [unique id util](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/core/lib/private/uniqueid.ts)
 * without the hashing part.
 *
 * And a few handy extra helper methods useful for development
 *
 */
export class SimpleStack extends Stack {
  protected allocateLogicalId(cfnElement: CfnElement) {
    const scopes = cfnElement.node.scopes
    const stackIndex = scopes.indexOf(cfnElement.stack)
    const pathComponents = scopes.slice(stackIndex + 1).map((x) => x.node.id)
    return makeUniqueId(pathComponents)
  }

  /**
   * Sets the stack to automatically destroy itself and all its resources
   * after a certain amount of time. @default 24hrs
   * Applies the "DESTROY" removal policy to all resources in the stack.
   * Use this method to automatically clean up all resources when the stack is deleted.
   */
  selfDestruct(props?: {
    /**
     * The amount of time to wait before destroying the stack
     * @default 24hrs
     */
    selfDestructAfter?: Duration
  }) {
    Annotations.of(this).addInfo(
      `Applying Self Destruct to all resources in stack: ${this.node.path}
                 this is handy for development to automatically remove resources
                 when the stack is deleted. But not recommended for production!\n`,
    )
    new SelfDestruct(this, 'SelfDestruct', {
      trigger: {
        scheduled: {
          enabled: true,
          afterDuration: props?.selfDestructAfter ?? Duration.hours(24),
        },
      },
      defaultBehavior: {
        destoryAllResources: true,
        purgeResourceDependencies: true,
        performAllAdditionalCleanup: true,
      },
      additionalCleanup: {
        cleanupLambdaLogGroups: true,
      },
    })
  }

  exportValue(exportedValue: any, options: ExportValueOptions = {}): string {
    if (options.name) {
      new CfnOutput(this, `Export${options.name}`, {
        value: exportedValue,
        exportName: options.name,
      })
      return Fn.importValue(options.name)
    }
    const resolvable = Tokenization.reverse(exportedValue)
    if (!resolvable || !Reference.isReference(resolvable)) {
      throw new Error(
        "exportValue: either supply 'name' or make sure to export a resource attribute (like 'bucket.bucketName')",
      )
    }
    // "teleport" the value here, in case it comes from a nested stack. This will also
    // ensure the value is from our own scope.
    const exportable = referenceNestedStackValueInParent(resolvable, this)
    // Ensure a singleton "Exports" scoping Construct
    // This mostly exists to trigger LogicalID munging, which would be
    // disabled if we parented constructs directly under Stack.
    // Also it nicely prevents likely construct name clashes
    const exportsScope = getCreateExportsScope(this)
    // Ensure a singleton CfnOutput for this value
    const resolved = this.resolve(exportable)
    const id = 'Output' + JSON.stringify(resolved)
    const exportName = generateExportName(exportsScope, id)
    if (Token.isUnresolved(exportName)) {
      throw new Error(
        `unresolved token in generated export name: ${JSON.stringify(
          this.resolve(exportName),
        )}`,
      )
    }
    const output = exportsScope.node.tryFindChild(id)
    if (!output) {
      new CfnOutput(exportsScope, id, {
        value: Token.asString(exportable),
        exportName,
      })
    }
    return Fn.importValue(exportName)
  }
}

function getCreateExportsScope(stack: Stack) {
  const exportsName = 'Exports'
  let stackExports = stack.node.tryFindChild(exportsName)
  if (stackExports === undefined) {
    stackExports = new Construct(stack, exportsName)
  }
  return stackExports
}

function generateExportName(stackExports: IConstruct, id: string) {
  const stackRelativeExports = FeatureFlags.of(stackExports).isEnabled(
    cxapi.STACK_RELATIVE_EXPORTS_CONTEXT,
  )
  const stack = Stack.of(stackExports)
  const components = [
    ...stackExports.node.scopes
      .slice(stackRelativeExports ? stack.node.scopes.length : 2)
      .map((c) => c.node.id),
    id,
  ]
  const prefix = stack.stackName ? stack.stackName + ':' : ''
  const localPart = makeUniqueId(components)
  const maxLength = 255
  return (
    prefix +
    localPart.slice(Math.max(0, localPart.length - maxLength + prefix.length))
  )
}
