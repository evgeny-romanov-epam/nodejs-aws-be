import {APIGatewayAuthorizerHandler, APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent} from 'aws-lambda';
import 'source-map-support/register';

export const basicAuthorizer: APIGatewayAuthorizerHandler = async (event, _context, callback) => {
    console.log("Event received", event);
    if (event.type != 'REQUEST') {
        callback('Unauthorized');
    }

    const requestEvent = <APIGatewayRequestAuthorizerEvent> event;
    const {Authorization} = requestEvent.headers;

    if (!Authorization) {
        callback('Unauthorized');
        return;
    }

    const token = Authorization.split(" ")[1];
    const [username, password] = Buffer.from(token, "base64")
        .toString()
        .split(":");

    if (username !== process.env.AUTH_USERNAME || password !== process.env.AUTH_PASSWORD) {
        callback("Unauthorized");
    }

    callback(null, generateResult(username, event.methodArn))

}

function generateResult(principalId, resource, effect = 'Allow'): APIGatewayAuthorizerResult {
    return {
        principalId,
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: effect,
                    Resource: [resource]
                }
            ]
        }
    };
}
