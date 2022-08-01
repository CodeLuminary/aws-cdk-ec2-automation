import boto3
import os
region = 'us-east-1' #You can change this region to your default region or any other region

ec2 = boto3.client('ec2', region_name=region)

def handler(event, context):
    ec2.start_instances(InstanceIds=[os.environ['instanceId']])
    print('started your instances: ' + str(os.environ['instanceId']))