import {
  DynamoDBClient,
  CreateTableCommand,
  ResourceInUseException,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { config } from "../config/env";
import { randomUUID } from "crypto";

const TABLE_NAME = "Users";

const client = new DynamoDBClient({
  endpoint: config.dynamodb.endpoint,
  region: config.dynamodb.region,
  credentials: { accessKeyId: "local", secretAccessKey: "local" },
});

const ddb = DynamoDBDocumentClient.from(client);

export async function ensureUsersTable(): Promise<void> {
  try {
    await client.send(
      new CreateTableCommand({
        TableName: TABLE_NAME,
        KeySchema: [{ AttributeName: "PK", KeyType: "HASH" }],
        AttributeDefinitions: [
          { AttributeName: "PK", AttributeType: "S" },
          { AttributeName: "email", AttributeType: "S" },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: "EmailIndex",
            KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
            Projection: { ProjectionType: "ALL" },
            ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
          },
        ],
        ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
      })
    );
  } catch (err) {
    if (!(err instanceof ResourceInUseException)) throw err;
  }
}

export interface UserRecord {
  id: string;
  email: string;
  hashedPassword: string;
  name: string;
  createdAt: string;
  preferredLLM: string;
}

export async function createUser(
  email: string,
  hashedPassword: string,
  name: string
): Promise<UserRecord> {
  const id = randomUUID();
  const user: UserRecord = {
    id,
    email,
    hashedPassword,
    name,
    createdAt: new Date().toISOString(),
    preferredLLM: "claude",
  };

  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { PK: `USER#${id}`, ...user },
      ConditionExpression: "attribute_not_exists(PK)",
    })
  );

  return user;
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const result = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email },
      Limit: 1,
    })
  );

  const item = result.Items?.[0];
  if (!item) return null;

  return item as UserRecord;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const result = await ddb.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { PK: `USER#${id}` } })
  );

  if (!result.Item) return null;
  return result.Item as UserRecord;
}

export async function updateUserPreferences(
  id: string,
  preferredLLM: string
): Promise<void> {
  await ddb.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: `USER#${id}` },
      UpdateExpression: "SET preferredLLM = :llm",
      ExpressionAttributeValues: { ":llm": preferredLLM },
    })
  );
}
