const aws = require('@aws-sdk/client-s3');

const s3_clients = [
    {conn: 'minio1', domain: 'hello.minio.test', bucket: 'hello', region: 'us-east-1', accessKeyId: 'minioadmin', secretAccessKey: 'minioadmin', endpoint: 'http://minio.test:9000'},
    {conn: 'minio2', domain: 'f1.minio.test', bucket: 'f1', region: 'us-east-1', accessKeyId: 'minioadmin', secretAccessKey: 'minioadmin', endpoint: 'http://minio.test:9000'},
    {conn: 'minio3', domain: 'f2.minio.test', bucket: 'f2', region: 'us-east-1', accessKeyId: 'minioadmin', secretAccessKey: 'minioadmin', endpoint: 'http://minio.test:9000'},
];

s3_clients.forEach(function (client) {
    client.s3 ??= new aws.S3Client({
        endpoint: client.endpoint,
        credentials: {
            accessKeyId: client.accessKeyId,
            secretAccessKey: client.secretAccessKey,
        },
        forcePathStyle: true,
        signatureVersion: 'v4',
        region: client.region,
        apiVersion: '2006-03-01',
    });
});

module.exports = s3_clients;
