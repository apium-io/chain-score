import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { QueryParams, PutParams, UpdateParams } from "../types/db.types";

export class Db {
    private docClient: DynamoDBDocumentClient;
    private client: DynamoDBClient;
    constructor() {
        this.client = new DynamoDBClient({});
        this.docClient = DynamoDBDocumentClient.from(this.client, {
            marshallOptions: { removeUndefinedValues: true },
        });
    }

    async fetchData(params: QueryParams) {
        try {
            return await this.docClient.send(new QueryCommand(params));
        } catch (error) {
            console.error(error);
            throw new Error('DB_FETCH_FAILED');
        }
    }

    async writeData(params: PutParams): Promise<boolean> {
        try {
            await this.docClient.send(new PutCommand(params));
            return true;
        } catch (error) {
            console.error(error);
            throw new Error('DB_SAVE_FAILED');
        }
    }

    async updateData(params: UpdateParams): Promise<boolean> {
        try {
            await this.docClient.send(new UpdateCommand(params));
            return true;
        } catch (error) {
            console.error(error);
            throw new Error('DB_SAVE_FAILED');
        }
    }

}
