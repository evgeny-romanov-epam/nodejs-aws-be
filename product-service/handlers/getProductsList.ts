import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {getProducts} from "../src/products";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
};

export const getProductsList: APIGatewayProxyHandler = async () => {
    const products = await getProducts();
    return {statusCode: 200, headers: corsHeaders, body: JSON.stringify(products, null, 2)}
}
