import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ec2 from 'aws-cdk-lib/aws-ec2'; 
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import {Rule, Schedule} from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets'

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    //Create a Virtual Private Cloud (VPC)
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      natGateways: 0,
    });

    //Create a security group
    const webserverSG = new ec2.SecurityGroup(this, 'webserver-sg', {
      vpc,
      allowAllOutbound: true,
    });
    //Add ingress rule for allowing http traffic
    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'allow HTTP traffic from anywhere',
    );

    //Add ingress rule for allowing https traffic
    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'allow HTTPS traffic from anywhere',
    );

    //Create an instance of Elastic Compute Cloud (EC2)
    const ec2Instance = new ec2.Instance(this,'ec2Instance', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
        machineImage: new ec2.AmazonLinuxImage(),
        vpc: vpc, //EC2 instance placed in a VPC
        securityGroup: webserverSG
    });

    //Create IAM role for lambda
    const StartRole = new iam.Role(this, "cdk-ec2-lambda-start-role", {
            assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        });
    StartRole.addToPolicy(
        new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
            ],
            resources: ["arn:aws:logs:*:*:*"],
        })
    );
    StartRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "ec2:Start*"
        ],
        resources: ["*"]
      })
    )
    //Create a lambda function
    const lambdaFnStart = new lambda.Function(this, "cdk-lambda-start-function", {
        code: lambda.AssetCode.fromAsset("StartEC2"),
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: "index.handler",
        role: StartRole,
        environment: {
            instanceId: ec2Instance.instanceId
        },
    });
    //Create IAM role for lambda
    const StopRole = new iam.Role(this, "cdk-ec2-lambda-stop-role", {
        assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });
    StopRole.addToPolicy(
        new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
            ],
            resources: ["arn:aws:logs:*:*:*"],
        })
    );
    StopRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "ec2:Stop*"
        ],
        resources: ["*"]
      })
    )
    //Create a lambda function
    const lambdaFnStop = new lambda.Function(this, "cdk-lambda-stop-function", {
        code: lambda.AssetCode.fromAsset("StopEC2"),
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: "index.handler",
        role: StopRole,
        environment: {
            instanceId: ec2Instance.instanceId
        },
    });
    //Create an Event Bridge
    const StartRule = new Rule (this, "ScheduleStartRule", {
      schedule: Schedule.cron({
        minute: '0', hour: '6'
      })
    })

    StartRule.addTarget(new targets.LambdaFunction(lambdaFnStart))

    //Create an Event Bridge
    const StopRule = new Rule (this, "ScheduleStopRule", {
      schedule: Schedule.cron({
        minute: '0', hour: '23'
      })
    })

    StopRule.addTarget(new targets.LambdaFunction(lambdaFnStop))
  }
}
