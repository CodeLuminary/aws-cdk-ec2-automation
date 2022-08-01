# AWS CDK EC2 Automation

This project is about automating AWS Elastic compute cloud (EC2) instances by starting them in the morning (6.00 AM UTC) and terminating them in the evening (11.00 PM UTC). The provisioning of the AWS resources are done using AWS Cloud development kit(CDK).


## Technology Stack & Tools

- [Amazon Web Service(AWS)](https://aws.amazon.com/) (Cloud Provider)
- [AWS CLI](https://aws.amazon.com/cli/) 
- Cloud Development Kit (CDK) - For infrastructure provisioning.
- Typescript - Language for infrastructure provisioning. Python, C#, Java can also be use.
- Python  - For writing lambda functions for automation. Javascript, C#, Java, Go and Ruby can also be use.

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/) - CDK is build on top of node thus you will need to install nodejs before installing CDK.
- Install and configure [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) using your generated AWS credentials

## Setting Up
### 1. Fork/Clone/Download the Repository 
### 2. Open project folder in a terminal

### 3. Install Dependencies:
```
$ cd cdk

$ npm install
```

## BOOTSTRAP & DEPLOY CDK

In the cdk directory, enter the following command

```
# To bootstrap the resources declared in the stack
$ cdk bootstrap

# (Optional) To output the cloud formation equivalent of the cdk stacks
$ cdk synth

# To deploy cdk stacks to AWS cloud
$ cdk deploy
```

 :dancers: :dancers: Violaa :) Your infrastructure have been provision using infrastructure as code.

## 🎩 Author

- IJONI VICTOR 😁😁😁

> Please :pray: don't forget to star :star: the project 😁😁 . Thanks :+1: