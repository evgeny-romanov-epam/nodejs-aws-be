import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {query} from "./pgClient";
import {corsHeaders} from "./cors";

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
    const productId = event.pathParameters && event.pathParameters['productId'] ? event.pathParameters['productId']
        : null;
    console.log(`getProductsById, productId=${productId}`);
    if (!productId) {
        return {statusCode: 400, headers: corsHeaders, body: JSON.stringify({error: "Missing product id"}, null, 2)}
    }

    try {
        const {rows: products} = await query("SELECT p.id, p.title, p.description, p.price, s.count " +
            "FROM product p INNER JOIN stock s ON p.id = s.product_id " +
            "WHERE p.id::text = $1", [productId]);
        if (products.length === 0) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({error: `Product with id ${productId} not found`}, null, 2)
            }
        }
        if (products.length > 1) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({error: `More than 1 product with id ${productId} found`}, null, 2)
            }
        }
        const product = products[0];
        return {statusCode: 200, headers: corsHeaders, body: JSON.stringify(product, null, 2)}
    } catch (e) {
        console.log("Error occurred while getting product by id", e);
        return {
            statusCode: 500, headers: corsHeaders,
            body: JSON.stringify({error: "Error occurred while getting product by id"}, null, 2)
        }
    }
}