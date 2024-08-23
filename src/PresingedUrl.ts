export type PresingedUrl = {
    key: string;
    url: string;
    fields: PreSignedUrlFields;
};
export type PreSignedUrlFields = {
    Policy: string;
    'X-Amz-Algorithm': string;
    'X-Amz-Credential': string;
    'X-Amz-Date': string;
    'X-Amz-Signature': string;
    'X-Amz-Security-Token': string;
    bucket: string;
};