import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {corsHeaders} from "../../commons/src/cors";

const AWS = require('aws-sdk');

const s3 = new AWS.S3({region: 'eu-west-1'});

export const importProductsFile: APIGatewayProxyHandler = async (event, _context) => {
    console.log(event);
    if (!event.queryStringParameters) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({error: "Missing query parameters"}, null, 2)
        }
    }
    const {name} = event.queryStringParameters;
    if (!name) {
        return {statusCode: 400, headers: corsHeaders, body: JSON.stringify({error: "Missing file name"}, null, 2)}
    }

    const parameters = {
        Bucket: process.env.S3_BUCKET,
        Key: `uploaded/${name}`,
        Expires: 60,
        ContentType: 'text/csv'
    }
    const url = await s3.getSignedUrlPromise('putObject', parameters);
    return {statusCode: 200, headers: corsHeaders, body: JSON.stringify(url, null, 2)}
}
