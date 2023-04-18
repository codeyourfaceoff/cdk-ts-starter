# Welcome to getting started with CDK TypeScript!

This is an introductory project intended to help new users get up and running with the [aws-cdk](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html) without the need to download or configure a local environment. It's a blank project to be easily built ontop of.

## Getting Started

The easiest and simplest way to get started is by clicking the "Gitpod" button below which will open the workspace in an online ide. **note:** it may take up to **5min** for the container to start up so please be patient. Gitpod is an online vscode ide which allows you to playaround and code as if running on your machine, but without all the hassle of installing some of the dependencies needed by this repo on your local machine. The only downside to this approach is the in ability to access configurations on your local machine like shell settings and aws credentials for deploying. 

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/privogpynes/cdk-ts-starter)

If you'd like to run this locally, another option is to install the [remote contianer extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) and then clone this repo and open in vscode. Or, even easier just click this badge [![Open in Visual Studio Code](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/privogpynes/cdk-ts-starter) and choose the `Clone repo in container volume` option.

This has the same affect as gitpod, where it will open the project in a docker container, but this time it will be configured with your local vscode's settings as well as mount your aws credentials into the container so you can deploy.

If you'd like run this fully locally, please see the [installation steps](#installation) below.

Once up and running you should see a preconfigured online (or local docker) vscode editor. Complete with some useful extensions + settings and it will already be running the `npm run dia:watch` command which generates a `.png` of the architecture as you save. It is recommended to open the `diagram.png` file as well as the `lib/cdk-ts-starter-stack.ts` file next to each other side-by-side to visualize changes in real-time.

**NOTE:** This project uses the `CDK V2` all that means is that it comes with all the stable modules preinstalled instead of needing to manually install them. For instance:

**V1**:

```ts
import * as ec2 from "@aws-cdk/aws-ec2";
import * as autoscaling from "@aws-cdk/aws-autoscaling";
// You would have to manually run
// `npm install @aws-cdk/aws-ec2`
// `npm install @aws-cdk/aws-autoscaling`
// to install both deps
```

**V2**:

```ts
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ec2 from "aws-cdk-lib/aws-autoscaling";
// Since 'aws-cdk-lib' is installed,
// both libs are installed and versions are in sync
```

To read more on the `V2` differences [see here](https://docs.aws.amazon.com/cdk/latest/guide/work-with-cdk-v2.html)

## Learning Resources

- [concepts](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html)
- [workshops](https://cdkworkshop.com/)
- [aws-cdk api reference](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html)
- [aws-cdk github](https://github.com/aws/aws-cdk)
- [aws-cdk hub](https://cdk.dev/)
- [aws-cdk patterns](https://cdkpatterns.com/)
- [aws-cdk solutions constructs](https://github.com/awslabs/aws-solutions-constructs)
- [awesome-cdk](https://github.com/kolomied/awesome-cdk)

## Useful commands

- `npm run dia` generate a png image of the architecture
- `npm run dia:watch` watch the filesystem for changes and automatically generate images as you save changes
- `npm run cdk synth` emits the synthesized CloudFormation template
- `npm run cdk diff` compare deployed stack with current state
- `npm run cdk deploy` deploy this stack to your default AWS account/region
- `npm run cdk bootstrap` configure the aws-cdk in your account/region
- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests

## Installation

This repo has a few dependencies before getting started. Namely:

- [nodejs](https://nodejs.org/en/download/) - v12 or higher
- [graphviz](http://www.graphviz.org/#download) - this is only needed if you want to generated the diagrams

Once those are installed locally, you can clone this repo and run all the commands listed above

Happy coding! 👋
