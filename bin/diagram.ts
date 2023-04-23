// @ts-ignore
process.env.GRAPH = true
import { CdkGraph, FilterPreset } from '@aws-prototyping-sdk/cdk-graph'
import {
  CdkGraphDiagramPlugin,
  DiagramFormat,
} from '@aws-prototyping-sdk/cdk-graph-plugin-diagram'
import { main as getApp } from './run'

const main = async () => {
  const app = await getApp()

  const graph = new CdkGraph(app, {
    plugins: [
      new CdkGraphDiagramPlugin({
        diagrams: [
          {
            name: 'diagram',
            title: 'App',
            format: DiagramFormat.PNG,
            theme: 'dark',
            filterPlan: {
              preset: FilterPreset.COMPACT,
            },
          },
        ],
      }),
    ],
  })

  app.synth()

  await graph.report()
}
main()
