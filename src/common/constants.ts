// export const CODE_POSSIBLE_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ23456789';
export const CODE_POSSIBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789';
export const ORDER_CODE_LEN = 8;
export const MAX_S3_DELETIONS = 1000;

export interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  s3ForcePathStyle: boolean;
  signatureVersion: string;
}
