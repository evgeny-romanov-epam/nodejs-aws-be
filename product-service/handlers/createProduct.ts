import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {transaction} from "../../commons/src/pgClient";
import {corsHeaders} from "../../commons/src/cors";

export const createProduct: APIGatewayProxyHandler = async (event, _context) => {
    if (!event.body) {
        return {statusCode: 400, headers: corsHeaders, body: JSON.stringify({error: "Missing product data"}, null, 2)}
    }
    console.log(`createProduct, body=${event.body}`);
    const reqData = JSON.parse(event.body);
    try {
        validate(reqData);
    } catch (err) {
        return {statusCode: 400, headers: corsHeaders, body: JSON.stringify({error: err}, null, 2)}
    }

    const {title, description, price, count} = reqData;
    try {
        const productId = await transaction(async client => {
            const response = await client.query("INSERT INTO product (title, description, price) VALUES ($1, $2, $3) RETURNING id", [title, description, price]);
            const productId = response.rows[0].id;
            await client.query("INSERT INTO stock (product_id, count) VALUES ($1, $2)", [productId, count])
            return productId;
        });
        return {statusCode: 200, headers: corsHeaders, body: JSON.stringify({id: productId, title: title, description: description, price: price, count: count}, null, 2)}
    } catch (e) {
        console.log("Error occurred while creating product", e);
        return {
            statusCode: 500, headers: corsHeaders,
            body: JSON.stringify({error: "Error occurred while creating product"}, null, 2)
        }
    }
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