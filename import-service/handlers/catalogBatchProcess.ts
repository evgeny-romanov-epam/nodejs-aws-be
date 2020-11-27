import {SQSHandler} from 'aws-lambda';
import 'source-map-support/register';
import {transaction} from "../../commons/src/pgClient";

const AWS = require('aws-sdk');

const sns = new AWS.SNS({region: 'eu-west-1'});

export const catalogBatchProcess: SQSHandler = async (event, _context) => {
    await Promise.all(event.Records.map(async record => {
        console.log("Processing record", record.body);

        const reqData = JSON.parse(record.body);
        try {
            validate(reqData);
        } catch (err) {
            console.error('Validation error', err);
            return;
        }

        const {title, description, price, count} = reqData;
        try {
            const productId = await transaction(async client => {
                const response = await client.query("INSERT INTO product (title, description, price) VALUES ($1, $2, $3) RETURNING id", [title, description, price]);
                const productId = response.rows[0].id;
                await client.query("INSERT INTO stock (product_id, count) VALUES ($1, $2)", [productId, count])
                return productId;
            });
            console.log('Product successfully created', productId);

            await sns.publish({
                Subject: `Product created`,
                Message: `Product ${productId} successfully created`,
                TopicArn: process.env.SNS_URL
            }, (err, data) =>  {
                console.log('Notification sent', err, data);
            }).promise();
        } catch (e) {
            console.log("Error occurred while creating product", e);
        }

    }));
}

function validate(requestData: any) {
    const {title, description, price, count} = requestData;
    if (!title) {
        throw 'No title specified';
    }
    if (!description) {
        throw 'No description specified';
    }
    if (!price) {
        throw 'No price specified';
    }
    if (!count) {
        throw 'No count specified';
    }
}
