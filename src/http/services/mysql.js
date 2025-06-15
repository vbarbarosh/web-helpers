const Perf = require('../helpers/Perf');
const Promise = require('bluebird');
const mysql2 = require('mysql2/promise');

const mysql_connections = [
    {conn: 'local', schema: 'hello', url: 'mysql://hello:hello@127.0.0.1/hello?debug=false&charset=utf8mb4&timezone=0'},
];

const routes = [
    {req: 'GET /api/v1/mysql/connections.json', fn: route_mysql_connections_list},
    {req: 'GET /api/v1/mysql/:conn/tables.json', fn: route_mysql_tables_list},
    {req: 'GET /api/v1/mysql/:conn/:table/rows.json', fn: route_mysql_rows_list},
];

// GET /api/v1/mysql/connections.json
async function route_mysql_connections_list(req, res)
{
    res.send({items: mysql_connections.map(v => v.conn)});
}

// GET /api/v1/mysql/:conn/tables.json
async function route_mysql_tables_list(req, res)
{
    const conn = await get_connection(req);

    const perf = new Perf();
    perf.checkpoint('List tables');
    const [rows, column_definitions] = await conn.client.query('SELECT * FROM information_schema.tables WHERE table_schema = ?', [conn.schema]);
    res.send({rows, column_definitions: column_definitions.map(v => v.inspect())})
}

// GET /api/v1/mysql/:conn/:table/rows.json
async function route_mysql_rows_list(req, res)
{
    const conn = await get_connection(req);

    const perf = new Perf();
    perf.checkpoint('List rows');

    const table = req.params.table;
    const limit = req.query.limit ?? 100;
    const offset = req.query.offset ?? 0;
    const [rows, column_definitions] = await conn.client.query(`SELECT * FROM ${mysql2.escapeId(table)} LIMIT ?`, [limit, offset]);

    res.send({rows, column_definitions: column_definitions.map(v => v.inspect())})
}

async function get_connection(req)
{
    const item = mysql_connections.find(v => v.conn = req.params.conn);
    if (!item) {
        throw new Error(`Invalid connection name: ${req.params.conn}. Allowed options are: ${mysql_connections.map(v => v.conn).join(', ')}.`);
    }
    item.client ??= await mysql2.createConnection(item.url);
    return item;
}

module.exports = {routes};
