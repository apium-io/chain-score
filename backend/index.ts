import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { submitTransactionService } from "./service/submit-transaction-service";
import { Contract } from "./types/submit-transaction-type";
import { Wallet } from "./types/wc-wallet.type";
import { fetchWalletWcData, saveWalletWcData } from "./service/wc-wallet-service";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        let response;
        switch (event.requestContext.resourceId) {
            case 'POST /contract/submit':
                const contractData = JSON.parse(event?.body || '{}') as Contract;
                response = await submitTransactionService(contractData);
                break;
            case 'POST /wallet/verify':
                const walletData = JSON.parse(event?.body || '{}') as Wallet;
                response = await saveWalletWcData(walletData);
                break;
            case 'GET /wallet/verify':
                const query = event.queryStringParameters;
                response = await fetchWalletWcData(query); // TODO: parse query in infra level api gw
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