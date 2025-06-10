Object.assign(window, {
    mongo_connections: () => http_get_json('/api/v1/mongo/connections.json'),
    mongo_databases: (conn) => http_get_json(`/api/v1/mongo/${conn}/databases.json`),

    mongo_collections: (conn, db) => http_get_json(`/api/v1/mongo/${conn}/${db}/collections.json`),
    mongo_analyze: (conn, db, col) => http_post_json(`/api/v1/mongo/${conn}/${db}/${col}/analyze`),
    mongo_drop_collection: (conn, db, col) => http_delete(`/api/v1/mongo/${conn}/${db}/${col}`),

    mongo_documents_list: (conn, db, col) => http_get_json(`/api/v1/mongo/${conn}/${db}/${col}/documents.json`),
    mongo_documents_fetch: (conn, db, col, doc_id) => http_get_json(`/api/v1/mongo/${conn}/${db}/${col}/documents/${doc_id}.json`),
    mongo_documents_create: (conn, db, col, doc) => http_post_json(`/api/v1/mongo/${conn}/${db}/${col}/documents`, doc),
    mongo_documents_replace: (conn, db, col, doc) => http_put_json(`/api/v1/mongo/${conn}/${db}/${col}/documents/${doc._id}`, doc),
    mongo_documents_remove: (conn, db, col, doc_id) => http_delete(`/api/v1/mongo/${conn}/${db}/${col}/documents/${doc_id}`),
});
