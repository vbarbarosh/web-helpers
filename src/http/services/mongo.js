const Perf = require('../helpers/Perf');
const Promise = require('bluebird');
const make_int = require('@vbarbarosh/type-helpers/src/make_int');
const {MongoClient, ObjectId} = require('mongodb');

const routes = [
    {req: 'GET /api/v1/mongo/connections.json', fn: route_mongo_connections},
    {req: 'GET /api/v1/mongo/:conn/databases.json', fn: route_mongo_databases},

    {req: 'GET /api/v1/mongo/:conn/:db/collections.json', fn: route_mongo_collections_list},
    {req: 'POST /api/v1/mongo/:conn/:db', fn: route_mongo_collections_create},
    {req: 'DELETE /api/v1/mongo/:conn/:db/:col', fn: route_mongo_collections_remove},

    {req: 'POST /api/v1/mongo/:conn/:db/:col/analyze', fn: route_mongo_analyze},
    {req: 'DELETE /api/v1/mongo/:conn/:db/:col', fn: route_mongo_drop_collection},

    {req: 'GET /api/v1/mongo/:conn/:db/:col/documents.json', fn: route_mongo_documents_list},
    {req: 'GET /api/v1/mongo/:conn/:db/:col/documents/:doc.json', fn: route_mongo_documents_fetch},
    {req: 'POST /api/v1/mongo/:conn/:db/:col/documents', fn: route_mongo_documents_create},
    {req: 'PUT /api/v1/mongo/:conn/:db/:col/documents/:doc', fn: route_mongo_documents_replace},
    {req: 'DELETE /api/v1/mongo/:conn/:db/:col/documents/:doc', fn: route_mongo_documents_remove},
];

const mongo_connections = {
    'local': new MongoClient('mongodb://root:root@127.0.0.1:27017'),
};

// GET /api/v1/mongo/connections.json
async function route_mongo_connections(req, res)
{
    res.send({items: Object.keys(mongo_connections)});
}

// GET /api/v1/mongo/:conn/databases.json
async function route_mongo_databases(req, res)
{
    const client = mongo_connections[req.params.conn];
    if (!client) {
        res.status(400).send(`Invalid connection name: ${req.params.conn}. Allowed options are: ${Object.keys(mongo_connections).join(', ')}.`);
        return;
    }

    const perf = new Perf();

    perf.checkpoint('List databases');
    const list = await client.db().admin().listDatabases();

    perf.checkpoint('Requesting stats for each database');
    const stats = await Promise.all(list.databases.map(v => client.db(v.name).stats()));

    list.databases.forEach(function (db, i) {
        db.stats = stats[i];
    });

    res.send({items: list.databases, perf});
}

// GET /api/v1/mongo/:conn/:db/collections.json
async function route_mongo_collections_list(req, res)
{
    const client = mongo_connections[req.params.conn];
    if (!client) {
        res.status(400).send(`Invalid connection name: ${req.params.conn}. Allowed options are: ${Object.keys(mongo_connections).join(', ')}.`);
        return;
    }

    const perf = new Perf();

    perf.checkpoint('Listing collections');
    const list = await client.db(req.params.db).listCollections().toArray();

    perf.checkpoint('Requesting stats for each collection');
    const stats = await Promise.all(list.map(v => client.db(req.params.db).collection(v.name).aggregate([{$collStats: {storageStats: {}}}]).toArray().then(v => v[0])));

    const items = list.map(function ({name}, i) {
        delete stats[i].storageStats.wiredTiger;
        delete stats[i].storageStats.indexDetails;
        return {name, storageStats: stats[i].storageStats}
    });

    res.send({items, perf});
}

// POST /api/v1/mongo/:conn/:db
async function route_mongo_collections_create(req, res)
{
    const client = mongo_connections[req.params.conn];
    if (!client) {
        res.status(400).send(`Invalid connection name: ${req.params.conn}. Allowed options are: ${Object.keys(mongo_connections).join(', ')}.`);
        return;
    }

    const perf = new Perf();

    perf.checkpoint('Creating collection');
    const col = await client.db(req.params.db).createCollection(req.body.name, req.body.options);
    const [stats] = await col.aggregate([{$collStats: {storageStats: {}}}]).toArray();
    res.send({name: req.body.name, stats});
}

// DELETE /api/v1/mongo/:conn/:db/:col
async function route_mongo_collections_remove(req, res)
{
    const client = mongo_connections[req.params.conn];
    if (!client) {
        res.status(400).send(`Invalid connection name: ${req.params.conn}. Allowed options are: ${Object.keys(mongo_connections).join(', ')}.`);
        return;
    }

    const perf = new Perf();

    perf.checkpoint('Dropping collection');
    const out = await client.db(req.params.db).dropCollection(req.params.col);
    res.send(out);
}

// GET /api/v1/mongo/:conn/:db/:col/documents.json
async function route_mongo_documents_list(req, res)
{
    const client = mongo_connections[req.params.conn];
    if (!client) {
        res.status(400).send(`Invalid connection name: ${req.params.conn}. Allowed options are: ${Object.keys(mongo_connections).join(', ')}.`);
        return;
    }

    const perf = new Perf();
    const col = client.db(req.params.db).collection(req.params.col);
    const limit = make_int(req.query.limit, 100, 0, 1000);
    const offset = make_int(req.query.offset, 0, 0);

    perf.checkpoint('Listing documents');
    const [total, items] = await Promise.all([
        col.estimatedDocumentCount(),
        col.find().skip(offset).limit(limit).toArray()
    ]);

    res.send({items, total, limit, offset, perf});
}

// GET /api/v1/mongo/:conn/:db/:col/documents/:doc.json
async function route_mongo_documents_fetch(req, res)
{
    const client = mongo_connections[req.params.conn];
    if (!client) {
        res.status(400).send(`Invalid connection name: ${req.params.conn}. Allowed options are: ${Object.keys(mongo_connections).join(', ')}.`);
        return;
    }

    const perf = new Perf();
    const col = client.db(req.params.db).collection(req.params.col);

    perf.checkpoint('Fetching document');
    const [out] = await col.find({_id: new ObjectId(req.params.doc)}).limit(1).toArray();

    if (!out) {
        res.status(404).send('Not Found');
    }
    else {
        res.send(out);
    }
}

// POST /api/v1/mongo/:conn/:db/:col/analyze
async function route_mongo_analyze(req, res)
{
    const {limit = 10000} = req.body;

    const client = mongo_connections[req.params.conn];
    if (!client) {
        res.status(400).send(`Invalid connection name: ${req.params.conn}. Allowed options are: ${Object.keys(mongo_connections).join(', ')}.`);
        return;
    }

    const perf = new Perf();
    const col = client.db(req.params.db).collection(req.params.col);

    // const pipeline = [
    //     {$limit: limit},
    //     {$project: {pairs: {$objectToArray: '$$ROOT.value'}}},
    //     {$unwind: '$pairs'},
    //     {$group: {_id: '$pairs.k', count: {$sum: 1}, uniq: {$addToSet: '$pairs.v'}}},
    //     {$group: {_id: null, fields: {$push: {name: '$_id', count: '$count', uniq: {$size: '$uniq'}}}}},
    // ];
    //
    // perf.checkpoint('Analyzing collection');
    // const [total, {fields}] = await Promise.all([
    //     col.estimatedDocumentCount(),
    //     col.aggregate(pipeline).toArray().then(v => v[0])
    // ]);

    perf.checkpoint('Analyzing collection');
    const [total, analyze] = await Promise.all([
        col.estimatedDocumentCount(),
        mongo_analyze(col),
    ]);

    analyze.fields.sort((b,a) => a.count - b.count);
    res.send({...analyze, total, limit, perf});
}

// DELETE /api/v1/mongo/:conn/:db/:col
async function route_mongo_drop_collection(req, res)
{
    const client = mongo_connections[req.params.conn];
    if (!client) {
        res.status(400).send(`Invalid connection name: ${req.params.conn}. Allowed options are: ${Object.keys(mongo_connections).join(', ')}.`);
        return;
    }

    const perf = new Perf();

    perf.checkpoint('Dropping collection');
    await client.db(req.params.db).collection(req.params.col).drop();

    res.send({perf});
}

// POST /api/v1/mongo/:conn/:db/:col/documents
async function route_mongo_documents_create(req, res)
{
    const client = mongo_connections[req.params.conn];
    if (!client) {
        res.status(400).send(`Invalid connection name: ${req.params.conn}. Allowed options are: ${Object.keys(mongo_connections).join(', ')}.`);
        return;
    }

    const {_id, ...rest} = req.body;

    const perf = new Perf();
    perf.checkpoint('Inserting document');

    const col = client.db(req.params.db).collection(req.params.col);
    const result = await col.insertOne(rest);

    res.send({_id: result.insertedId, perf});
}

// PUT /api/v1/mongo/:conn/:db/:col/documents/:doc
async function route_mongo_documents_replace(req, res)
{
    const client = mongo_connections[req.params.conn];
    if (!client) {
        res.status(400).send(`Invalid connection name: ${req.params.conn}. Allowed options are: ${Object.keys(mongo_connections).join(', ')}.`);
        return;
    }

    const {_id, ...rest} = req.body;
    if (req.params.doc !== _id) {
        throw new Error("Cannot change the _id of an existing document.");
    }

    const perf = new Perf();
    perf.checkpoint('Replacing document');

    const col = client.db(req.params.db).collection(req.params.col);
    const result = await col.replaceOne({_id: new ObjectId(_id)}, rest);

    res.send({result, perf});
}

// DELETE /api/v1/mongo/:conn/:db/:col/documents/:doc
async function route_mongo_documents_remove(req, res)
{
    const client = mongo_connections[req.params.conn];
    if (!client) {
        res.status(400).send(`Invalid connection name: ${req.params.conn}. Allowed options are: ${Object.keys(mongo_connections).join(', ')}.`);
        return;
    }

    const col = client.db(req.params.db).collection(req.params.col);
    const doc_id = req.params.doc;

    const {ObjectId} = require('mongodb');
    let _id;
    try {
        _id = new ObjectId(doc_id);
    } catch (e) {
        res.status(400).send(`Invalid document ID: ${doc_id}`);
        return;
    }

    const perf = new Perf();
    perf.checkpoint('Deleting document');

    const result = await col.deleteOne({_id});

    res.send({
        deletedCount: result.deletedCount,
        perf
    });
}

async function mongo_analyze(col, limit = 50000)
{
    const pipeline = [
        {$limit: limit},
        {$project: {pairs: {$objectToArray: '$$ROOT.value'}}},
        {$unwind: '$pairs'},
        {$group: {
                _id: {k: '$pairs.k', v: '$pairs.v'},
                count1: {$sum: 1},
            }},
        {$group: {
                _id: '$_id.k',
                count: {$sum: '$count1'},
                uniq: {$addToSet: '$_id.v'},
                types: {$addToSet: {$type: '$_id.v'}},
                values: {$push: {value: '$_id.v', count: '$count1'}},
            }},
        {$project: {
                _id: false,
                name: '$_id',
                count: '$count',
                uniq: {$size: '$uniq'},
                types: '$types',
                most10: {$slice: [{$sortArray: {input: '$values', sortBy: {count: -1, value: 1}}}, 10]}
            }},
    ];

    const [total, fields] = await Promise.all([
        col.estimatedDocumentCount(),
        col.aggregate(pipeline).toArray().then(v => v || [])
    ]);

    fields.sort((b,a) => a.count - b.count);
    const out = {collection: col.collectionName, fields, total, limit};

    // out.openai_guess_fields = await openai_guess_fields(JSON.parse(JSON.stringify(out)));
    return out;
}

module.exports = {routes};
