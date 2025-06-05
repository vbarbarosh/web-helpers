Object.assign(window, {
    mongo_connections: () => http_get_json('/api/v1/mongo/connections.json'),
    mongo_databases: (conn) => http_get_json(`GET /api/v1/mongo/${conn}/databases.json`),
    mongo_collections: (conn, db) => http_get_json(`/api/v1/mongo/${conn}/${db}/collections.json`),
    mongo_documents: (conn, db, col) => http_get_json(`/api/v1/mongo/${conn}/${db}/${col}/documents.json`),
    mongo_analyze: (conn, db, col) => http_post_json(`/api/v1/mongo/${conn}/${db}/${col}/analyze`),
    mongo_drop_collection: (conn, db, col) => http_delete(`/api/v1/mongo/${conn}/${db}/${col}`),
});
