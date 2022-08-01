# AWS CDK EC2 Automation

This project is about automating AWS Elastic compute cloud (EC2) instances by starting them in the morning and terminating them in the evening. The provisioning of the AWS resources are done using AWS Cloud development kit(CDK).


## Technology Stack & Tools

- [Amazon Web Service(AWS)](https://aws.amazon.com/) (Cloud Provider)
- [AWS CLI](https://aws.amazon.com/cli/) 
- Cloud Development Kit (CDK) - For infrastructure provisioning.
- Typescript - Language for infrastructure provisioning. Python, C#, Java can also be use.
- Python  - For writing lambda functions for automation. Javascript, C#, Java, Go and Ruby can also be use.

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/) - CDK is build on top of node thus you will need to install nodejs before installing CDK.
- Install and configure [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) using your generated AWS credentials
