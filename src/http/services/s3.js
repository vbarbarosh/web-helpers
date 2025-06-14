const Perf = require('../helpers/Perf');
const Promise = require('bluebird');
const aws = require('@aws-sdk/client-s3');
const express = require('express');
const s3_clients = require('../helpers/s3_clients');
const s3_request_presigner = require('@aws-sdk/s3-request-presigner');

let mime;

async function init()
{
    mime = (await import('mime')).default;
}

const routes = [
    {req: 'GET /api/v1/s3/connections.json', fn: route_s3_connections},
    {req: 'GET /api/v1/s3/:conn/buckets.json', fn: route_s3_buckets_list},
    {req: 'POST /api/v1/s3/:conn', fn: route_s3_buckets_create},
    {req: 'DELETE /api/v1/s3/:conn/:bucket', fn: route_s3_buckets_remove},

    {req: 'GET /api/v1/s3/:conn/:bucket/:path(*)?', fn: route_s3_objects_list},
    {req: 'PUT /api/v1/s3/:conn/:bucket/:path(*)?', fn: route_s3_objects_replace, middleware: express.raw({type: v => true, limit: '210mb'})},
    {req: 'DELETE /api/v1/s3/:conn/:bucket/:path(*)?', fn: route_s3_objects_remove},
    {req: 'POST /api/v1/s3/:conn/:bucket/sign-get', fn: route_s3_objects_sign_get},
    {req: 'POST /api/v1/s3/:conn/:bucket/sign-put', fn: route_s3_objects_sign_put},
];

// GET /api/v1/s3/connections.json
async function route_s3_connections(req, res)
{
    res.send({items: s3_clients.map(v => v.conn)});
}

// GET /api/v1/s3/:conn/buckets.json
async function route_s3_buckets_list(req, res)
{
    const client = get_client(req);

    const perf = new Perf();

    perf.checkpoint('List buckets');
    const response = await client.s3.send(new aws.ListBucketsCommand());

    perf.checkpoint('Requesting stats for each bucket');
    await Promise.map(response.Buckets, mapper, {concurrency: 10});
    async function mapper(item) {
        try {
            const response = await client.s3.send(new aws.GetBucketPolicyCommand({Bucket: item.Name}));
            item.Policy = JSON.parse(response.Policy);
        }
        catch (error) {
            item.Policy = null;
            item.PolicyError = error.message;
        }
    }

    res.send({items: response.Buckets, perf});
}

// POST /api/v1/s3/:conn
async function route_s3_buckets_create(req, res)
{
    const client = get_client(req);
    const perf = new Perf();
    const {Bucket} = req.body;
    perf.checkpoint('Creating bucket');
    const response = await client.s3.send(new aws.CreateBucketCommand({
        Bucket,
        ACL: 'private',
    }));
    res.send({Bucket, response, perf});
}

// DELETE /api/v1/s3/:conn/:bucket
async function route_s3_buckets_remove(req, res)
{
    const client = get_client(req);
    const perf = new Perf();
    perf.checkpoint('Creating bucket');
    const response = await client.s3.send(new aws.DeleteBucketCommand({
        Bucket: req.params.bucket
    }));
    res.send({response, perf});
}

// GET /api/v1/s3/:conn/:bucket/:path(*)?
async function route_s3_objects_list(req, res)
{
    const client = get_client(req);
    const perf = new Perf();

    const Bucket = req.params.bucket;

    perf.checkpoint('List buckets');
    const response = await client.s3.send(new aws.ListObjectsCommand({
        Bucket,
        Prefix: req.params.path ?? '',
        MaxKeys: 100,
        Marker: req.query.Marker,
    }));

    response.Contents ??= [];

    perf.checkpoint('Requesting stats for each object');
    await Promise.map(response.Contents, mapper, {concurrency: 100});
    async function mapper(item) {
        const [head, acl, tagging] = await Promise.all([
            client.s3.send(new aws.HeadObjectCommand({Bucket, Key: item.Key})),
            client.s3.send(new aws.GetObjectAclCommand({Bucket, Key: item.Key})),
            client.s3.send(new aws.GetObjectTaggingCommand({Bucket, Key: item.Key}))
        ]);
        item.Head = {...head, '$metadata': undefined};
        item.Grants = acl.Grants;
        item.TagSet = tagging.TagSet;
    }

    res.send({...response, perf});
}

// PUT /api/v1/s3/:conn/:bucket/:path(*)?
async function route_s3_objects_replace(req, res)
{
    const client = get_client(req);
    const perf = new Perf();

    const Bucket = req.params.bucket;
    const Key = req.params.path ?? '';
    const ContentType = req.query.type ?? mime.getType(Key);

    perf.checkpoint('Uploading');
    const response = await client.s3.send(new aws.PutObjectCommand({
        Bucket,
        Key,
        Body: req.body,
        ContentType,
    }));

    res.send({response, perf});
}

// DELETE /api/v1/s3/:conn/:bucket/:path(*)?
async function route_s3_objects_remove(req, res)
{
    const client = get_client(req);
    const perf = new Perf();

    perf.checkpoint('Removing');
    const response = await client.s3.send(new aws.DeleteObjectCommand({
        Bucket: req.params.bucket,
        Key: req.params.path ?? '',
    }));

    res.send({response, perf});
}

// POST /api/v1/s3/:conn/:bucket/sign-get
async function route_s3_objects_sign_get(req, res)
{
    const client = get_client(req);
    const perf = new Perf();

    console.log({Bucket: req.params.bucket, Key: req.body.Key});

    perf.checkpoint('Generating sign_get url');
    const url = await s3_request_presigner.getSignedUrl(client.s3,
        new aws.GetObjectCommand({Bucket: req.params.bucket, Key: req.body.Key}, {expiresInSeconds: 600}));

    res.send({url, perf});
}

// POST /api/v1/s3/:conn/:bucket/sign-put
async function route_s3_objects_sign_put(req, res)
{
    const client = get_client(req);
    const perf = new Perf();

    perf.checkpoint('Generating sign_get url');
    const url = await s3_request_presigner.getSignedUrl(client.s3,
        new aws.PutObjectCommand({Bucket: req.params.bucket, Key: req.body.Key}, {expiresInSeconds: 600}));

    res.send({url, perf});
}

function get_client(req)
{
    const out = s3_clients.find(v => v.conn = req.params.conn);
    if (!out) {
        throw new Error(`Invalid connection name: ${req.params.conn}. Allowed options are: ${s3_clients.map(v => v.conn).join(', ')}.`);
    }
    return out;
}

module.exports = {init, routes};
