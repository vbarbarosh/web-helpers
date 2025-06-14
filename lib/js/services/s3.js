Object.assign(window, {
    s3_connections_list: () => http_get_json('/api/v1/s3/connections.json'),
    s3_buckets_list: (conn) => http_get_json(`/api/v1/s3/${conn}/buckets.json`),
    s3_buckets_create: (conn, Bucket) => http_post_json(`/api/v1/s3/${conn}`, {Bucket}),
    s3_buckets_remove: (conn, Bucket) => http_delete(`/api/v1/s3/${conn}/${Bucket}`),
    s3_objects_list: (conn, bucket, Prefix, Marker) => http_get_json(urlmod(`/api/v1/s3/${conn}/${bucket}/${Prefix}`.replaceAll('//', '/'), {Marker})),
    s3_objects_replace: (conn, bucket, key, body) => http_put_json(`/api/v1/s3/${conn}/${bucket}/${key}`, body),
    s3_objects_remove: (conn, bucket, key) => http_delete(`/api/v1/s3/${conn}/${bucket}/${key}`),
    s3_objects_sign_get: (conn, bucket, Key) => http_post_json(`/api/v1/s3/${conn}/${bucket}/sign-get`, {Key}),
    s3_objects_sign_put: (conn, bucket, Key) => http_post_json(`/api/v1/s3/${conn}/${bucket}/sign-put`, {Key}),
});
