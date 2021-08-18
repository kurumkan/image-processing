import AWS, { AWSError, S3 } from 'aws-sdk';
const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_URL!);

const bucket = process.env.SPACES_BUCKET!;

class AwsS3 {
    private client;
    constructor() {
        this.client = new AWS.S3({
            endpoint: spacesEndpoint,
            accessKeyId: process.env.SPACES_KEY!,
            secretAccessKey: process.env.SPACES_SECRET!
        });
    }

    public deleteObject(folder:string, fileName: string, callback: (error: AWSError, data: S3.Types.DeleteObjectOutput) => void): void {
        const params = {
            Bucket: bucket,
            Key: `${folder}/${fileName}`
        }
        this.client.deleteObject(params, callback)
    }

    public getSignedUrl(folder:string, fileName:string, contentType: string): string {
        const expireSeconds = 60 * 5;

        const params = {
            Key: `${folder}/${fileName}`,
            Expires: expireSeconds,
            Bucket: bucket,
            ContentType: contentType
        };
        return this.client.getSignedUrl('putObject', params);
    }

    public listObjects(folder:string, callback: (err: AWSError, data: S3.Types.ListObjectsOutput) => void):void {
        const params = {
            Bucket: bucket,
            Prefix: folder
        };

        this.client.listObjects(params, callback);
    }
}

class AwsClient {
    private static instance: AwsS3;
    constructor() {}

    public static getInstance(): AwsS3 {
        if (!AwsClient.instance) {
            AwsClient.instance = new AwsS3();
        }

        return AwsClient.instance;
    }
}

export { AwsClient };
