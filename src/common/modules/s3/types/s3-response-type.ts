import { S3 } from 'aws-sdk';

export class S3ResponseType {
  deleteObjectsOutput?: S3.DeleteObjectsOutput;
  error?: Error & {
    code: string;
    message: string;
    retryable?: boolean;
    statusCode?: number;
    time: Date;
    hostname?: string;
    region?: string;
    retryDelay?: number;
    requestId?: string;
    extendedRequestId?: string;
    cfId?: string;
    originalError?: Error;
  };
}
