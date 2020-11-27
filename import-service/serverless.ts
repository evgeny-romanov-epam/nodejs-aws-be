import type {Serverless} from 'serverless/aws';

const serverlessConfiguration: Serverless = {
    service: {
        name: 'import-service',
        // app and org for use with dashboard.serverless.com
        // app: your-app-name,
        // org: your-org-name,
    },
    frameworkVersion: '2',
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true
        }
    },
    // Add the serverless-webpack plugin
    plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
    provider: {
        name: 'aws',
        runtime: 'nodejs12.x',
        stage: 'dev',
        region: 'eu-west-1',
        apiGateway: {
            minimumCompressionSize: 1024,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            S3_BUCKET: 'evgeny-romanov-rs-csv',
            SQS_URL: {
                Ref: 'catalogItemsQueue'
            },
            SNS_URL: {
                Ref: 'createProductTopic'
            }
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: 's3:ListBucket',
                Resource: 'arn:aws:s3:::evgeny-romanov-rs-csv'
            },
            {
                Effect: 'Allow',
                Action: 's3:*',
                Resource: 'arn:aws:s3:::evgeny-romanov-rs-csv/*'
            },
            {
                Effect: 'Allow',
                Action: 'sqs:*',
                Resource: {
                    'Fn::GetAtt': ['catalogItemsQueue', 'Arn']
                }
            },
            {
                Effect: 'Allow',
                Action: 'sns:*',
                Resource: {
                    Ref: 'createProductTopic'
                }
            }
        ]
    },
    resources: {
        Resources: {
            catalogItemsQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'rs-products-sqs'
                }
            },
            createProductTopic: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    TopicName: 'rs-products-sns'
                }
            },
            createProductTopicSubscription: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Endpoint: 'evgeny_romanov_epam_rss@protonmail.com',
                    Protocol: 'email',
                    TopicArn: {
                        Ref: 'createProductTopic'
                    }
                }
            }
        }
    },
    functions: {
        importProductsFile: {
            handler: 'handler.importProductsFile',
            events: [
                {
                    http: {
                        method: 'get',
                        path: 'import',
                        cors: true,
                        request: {
                            parameters: {
                                querystrings: {
                                    name: true
                                }
                            }
                        },
                        authorizer: {
                            name: 'importBasicAuthorizer',
                            arn: '${cf:authorization-service-${self:provider.stage}.BasicAuthorizerLambdaFunctionQualifiedArn}',
                            resultTtlInSeconds: 0,
                            identitySource: 'method.request.header.Authorization',
                            type: 'request'
                        }
                    }
                }
            ]
        },
        importFileParser: {
            handler: 'handler.importFileParser',
            events: [
                {
                    s3: {
                        bucket: 'evgeny-romanov-rs-csv',
                        event: 's3:ObjectCreated:*',
                        rules: [{
                            prefix: 'uploaded',
                            suffix: '',
                        }],
                        existing: true
                    }
                }
            ]
        },
        catalogBatchProcess: {
            handler: 'handler.catalogBatchProcess',
            events: [
                {
                    sqs: {
                        batchSize: 5,
                        arn: {
                            'Fn::GetAtt': ['catalogItemsQueue', 'Arn']
                        }
                    }
                }
            ]
        }
    }
}

module.exports = serverlessConfiguration;
