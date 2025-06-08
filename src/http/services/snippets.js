const Promise = require('bluebird');
const fs_path_resolve = require('@vbarbarosh/node-helpers/src/fs_path_resolve');
const fs_read_utf8 = require('@vbarbarosh/node-helpers/src/fs_read_utf8');
const fs_readdir = require('@vbarbarosh/node-helpers/src/fs_readdir');

// https://docs.docker.com/reference/api/engine/version/v1.39/#tag/Container/operation/ContainerList

const routes = [
    {req: 'GET /api/v1/snippets.json', fn: snippets_list},
];

// GET /api/v1/snippets.json
async function snippets_list(req, res)
{
    const d = fs_path_resolve(__dirname, '../../../demos/snippets');
    const items = await Promise.map(fs_readdir(d), mapper, {concurrency: 50});
    res.send(items);

    async function mapper(file) {
        const body = await fs_read_utf8(fs_path_resolve(d, file));
        return {
            file,
            ...parse_snippet(body),
        };
    }
}

function parse_snippet(body)
{
    let title = null;
    body = body.replace(/^#\s*(.*)\s*$/m, function (match, m1) {
        title = m1;
        return '';
    });
    let vue_counter = 1;
    // body = body.replace(/^```vue$(.*?)^```$/gms, function (match, m1) {
    //     return `<--vue${vue_counter++}-->`;
    // });
    return {title, body};
}

module.exports = {routes};
