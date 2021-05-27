import * as cdk from '@aws-cdk/core';
import { CustomResource } from '@aws-cdk/core';
import * as logs from '@aws-cdk/aws-logs';
import * as cr from '@aws-cdk/custom-resources';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';


import * as path from 'path';

export class CdkCustomResourceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const COLLECTION_ID = "DEMO_CUSTOM_RESOURCE";

    const rekognitionCustomResourceRole = new iam.Role(this, 'rekognitionCustomResourceRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    rekognitionCustomResourceRole.addToPolicy(new iam.PolicyStatement({
      resources: ['arn:aws:rekognition:*'],
      actions: ['rekognition:CreateCollection', 'rekognition:DeleteCollection']
    }))

    const onEvent = new lambda.Function(this, 'rekognitionCustomResourceFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'rekognition-custom-resource.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'functions')),
      environment: {
        COLLECTION_ID: COLLECTION_ID
      },
      role: rekognitionCustomResourceRole
    });

    const rekognitionCustomResourceProvider = new cr.Provider(this, 'rekognitionCustomResourceProvider', {
      onEventHandler: onEvent,
      logRetention: logs.RetentionDays.ONE_DAY,
    });

    new CustomResource(this, 'rekognitionCustomResource', {
      serviceToken: rekognitionCustomResourceProvider.serviceToken
    });

  }
}
