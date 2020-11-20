import {S3Handler} from 'aws-lambda';
import 'source-map-support/register';

const AWS = require('aws-sdk');
const csv = require('csv-parser');

const s3 = new AWS.S3({region: 'eu-west-1'});
const sqs = new AWS.SQS({region: 'eu-west-1'});

export const importFileParser: S3Handler = async (event, _context) => {
    await Promise.all(event.Records.map(async record => {
        const key = record.s3.object.key;
        console.log("Processing object", key);

        const s3Stream = s3.getObject({Bucket: process.env.S3_BUCKET, Key: key}).createReadStream();

        const csvData = await parseCSV(s3Stream);
        console.log('CSV data', csvData)

        await s3Move(process.env.S3_BUCKET, key, key.replace("uploaded", "parsed"));

        console.log('Sending data to ', process.env.SQS_URL);
        await Promise.all(csvData.map(item =>
            sqs.sendMessage({
                QueueUrl: process.env.SQS_URL,
                MessageBody: JSON.stringify(item)
            }, (err, data) => {
                console.log('Message sent', err, data);
            }).promise()
        ));
    }));
}

async function s3Move(bucket: string, key: string, toKey: string): Promise<any> {
    console.log(`Moving object from ${bucket}/${key} to ${toKey}`);
    await s3.copyObject({
        Bucket: bucket,
        CopySource: `${bucket}/${key}`,
        Key: toKey
    }).promise();
    await s3.deleteObject({
        Bucket: bucket,
        Key: key
    }).promise();
}

function parseCSV(s3Stream: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const rows = [];
        s3Stream
            .on('error', error => {
                console.log('Error', error);
                reject();
            })
            .pipe(csv())
            .on('data', row => {
                console.log('CSV Row', row);
                rows.push(row);
            })
            .on('end', () => {
                console.log('CSV Parsing finished');
                resolve(rows)
            });
    });
}