import {S3Handler} from 'aws-lambda';
import 'source-map-support/register';

const AWS = require('aws-sdk');
const csv = require('csv-parser');

const s3 = new AWS.S3({region: 'eu-west-1'});
const bucket = 'evgeny-romanov-rs-csv';

export const importFileParser: S3Handler = async (event, _context) => {
    event.Records.forEach(record => {
        const key = record.s3.object.key;
        console.log("Processing object", key);

        const s3Stream = s3.getObject({Bucket: bucket, Key: key}).createReadStream();
        s3Stream.on('error', error => {
            console.log('File processing failed', error)
        })

        s3Stream
            .pipe(csv())
            .on('data', (data) => {
                console.log('CSV data', data)
            })
            .on('end', async () => {
                console.log('CSV parsing finished')
                const toObject = key.replace("uploaded", "parsed");
                console.log('Moving object to', toObject)
                await s3.copyObject({
                    Bucket: bucket,
                    CopySource: `${bucket}/${key}`,
                    Key: toObject
                }).promise()
                await s3.deleteObject({
                    Bucket: bucket,
                    Key: key
                })
            })
            .on('error', error => {
                console.log('CSV parsing failed', error)
            });
    })
}
