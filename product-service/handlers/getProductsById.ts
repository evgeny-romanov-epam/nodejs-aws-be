import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {getProductById} from "../src/products";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
};

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
    const productId = event.pathParameters && event.pathParameters['productId'] ? event.pathParameters['productId']
        : null;
    if (!productId) {
        return {statusCode: 400, headers: corsHeaders, body: JSON.stringify({error: "Missing product id"}, null, 2)}
    }
    try {
        const product = await getProductById(productId);
        return {statusCode: 200, headers: corsHeaders, body: JSON.stringify(product, null, 2)}
    } catch (e) {
        return {statusCode: 404, headers: corsHeaders, body: JSON.stringify({error: e}, null, 2)}
    }
}