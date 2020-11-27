import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import {query} from "../../commons/src/pgClient";
import {corsHeaders} from "../../commons/src/cors";

export const getProductsList: APIGatewayProxyHandler = async () => {
    console.log(`getProductsList`);

    try {
        const {rows: products} = await query("SELECT p.id, p.title, p.description, p.price, s.count " +
            "FROM product p INNER JOIN stock s ON p.id = s.product_id");
        return {statusCode: 200, headers: corsHeaders, body: JSON.stringify(products, null, 2)}
    } catch (e) {
        console.log("Error occurred while getting a list of channels", e);
        return {
            statusCode: 500, headers: corsHeaders,
            body: JSON.stringify({error: "Error occurred while getting a list of channels"}, null, 2)
        }
    }
}
