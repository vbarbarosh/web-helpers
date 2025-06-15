Object.assign(window, {
    mysql_connections_list: () => http_get_json('/api/v1/mysql/connections.json'),
    mysql_tables_list: (conn) => http_get_json(`/api/v1/mysql/${conn}/tables.json`),
    mysql_rows_list: (conn, table, filters) => http_get_json(urlmod(`/api/v1/mysql/${conn}/${table}/rows.json`, filters)),
});
