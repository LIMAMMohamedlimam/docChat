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
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { config } from "../config/env";
import { randomUUID } from "crypto";

const TABLE_NAME = "Documents";

const client = new DynamoDBClient({
  endpoint: config.dynamodb.endpoint,
  region: config.dynamodb.region,
  credentials: { accessKeyId: "local", secretAccessKey: "local" },
});

const ddb = DynamoDBDocumentClient.from(client);

export async function ensureDocumentsTable(): Promise<void> {
  try {
    await client.send(
      new CreateTableCommand({
        TableName: TABLE_NAME,
        KeySchema: [{ AttributeName: "PK", KeyType: "HASH" }],
        AttributeDefinitions: [
          { AttributeName: "PK", AttributeType: "S" },
          { AttributeName: "GSI1PK", AttributeType: "S" },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: "UserDocumentsIndex",
            KeySchema: [{ AttributeName: "GSI1PK", KeyType: "HASH" }],
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

export interface DocumentRecord {
  id: string;
  userId: string;
  filename: string;
  mimeType: string;
  s3Key: string;
  sizeBytes: number;
  uploadedAt: string;
  extractedText: string;
  chunks: string[];
}

export async function createDocument(
  userId: string,
  filename: string,
  mimeType: string,
  s3Key: string,
  sizeBytes: number,
  extractedText: string,
  chunks: string[]
): Promise<DocumentRecord> {
  const id = randomUUID();
  const doc: DocumentRecord = {
    id,
    userId,
    filename,
    mimeType,
    s3Key,
    sizeBytes,
    uploadedAt: new Date().toISOString(),
    extractedText,
    chunks,
  };

  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `DOC#${id}`,
        GSI1PK: `USER#${userId}`,
        ...doc,
      },
    })
  );

  return doc;
}

export async function getDocumentsByUser(userId: string): Promise<DocumentRecord[]> {
  const result = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "UserDocumentsIndex",
      KeyConditionExpression: "GSI1PK = :gsi1pk",
      ExpressionAttributeValues: { ":gsi1pk": `USER#${userId}` },
    })
  );

  return (result.Items ?? []) as DocumentRecord[];
}

export async function getDocumentById(id: string): Promise<DocumentRecord | null> {
  const result = await ddb.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { PK: `DOC#${id}` } })
  );

  if (!result.Item) return null;
  return result.Item as DocumentRecord;
}

export async function updateDocumentChunks(
  id: string,
  chunks: string[]
): Promise<void> {
  await ddb.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: `DOC#${id}` },
      UpdateExpression: "SET chunks = :chunks",
      ExpressionAttributeValues: { ":chunks": chunks },
    })
  );
}

export async function deleteDocument(id: string): Promise<void> {
  await ddb.send(
    new DeleteCommand({ TableName: TABLE_NAME, Key: { PK: `DOC#${id}` } })
  );
}
