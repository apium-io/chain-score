import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { submitTransactionService } from "./service/submit-transaction-service";
import { Contract } from "./types/submit-transaction-type";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        let response;
        switch (event.requestContext.resourceId) {
            case 'POST /contract/submit':
                const contractData = JSON.parse(event?.body || '{}') as Contract;
                response = await submitTransactionService(contractData);
                break;
            default:
                throw new Error('Method not allowed');
        }


        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Form data received successfully',
                data: response,
            }),
        };
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Internal Server Error',
            }),
        };
    }
}