import { ReturnConsumedCapacity } from "@aws-sdk/client-dynamodb";

export type LastEvaluatedKey = Record<string, any>;

export type PutParams = {
    TableName: string;
    Item: any;
    IndexName?: string;
};

export type QueryParams = {
    TableName: string;
    IndexName?: string;
    KeyConditionExpression?: string;
    FilterExpression?: string;
    ExpressionAttributeNames?: {
        [key: string]: string;
    };
    ExpressionAttributeValues?: {
        [key: string]: any;
    };
    ProjectionExpression?: string;
    ExclusiveStartKey?: LastEvaluatedKey;
    Limit?: number;
    ReturnConsumedCapacity?: ReturnConsumedCapacity;
};

export type UpdateParams = {
    TableName: string;
    Key: any;
    UpdateExpression: string;
    ExpressionAttributeNames: { [key: string]: string };
    ExpressionAttributeValues: { [key: string]: any };
};