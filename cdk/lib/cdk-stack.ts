import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ec2 from 'aws-cdk-lib/aws-ec2'; 
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      natGateways: 0,
    });

    const webserverSG = new ec2.SecurityGroup(this, 'webserver-sg', {
      vpc,
      allowAllOutbound: true,
    });

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'allow HTTP traffic from anywhere',
    );

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'allow HTTPS traffic from anywhere',
    );

    const ec2Instance = new ec2.Instance(this,'ec2Instance', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
        machineImage: new ec2.AmazonLinuxImage(),
        vpc: vpc,
        securityGroup: webserverSG
    })

    const lambdaFn = new lambda.Function(this, "cdk-lambda-start-function", {
        code: lambda.AssetCode.fromAsset("lambda"),
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: "StartEC2.handler",
        environment: {
            instanceId: ec2Instance.instanceId
        },
    });

  }
}
