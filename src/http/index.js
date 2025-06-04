#!/usr/bin/env node

require('@dotenvx/dotenvx').config();

const body_parser = require('body-parser');
const cli = require('@vbarbarosh/node-helpers/src/cli');
const express = require('express');
const express_params = require('@vbarbarosh/express-helpers/src/express_params');
const express_routes = require('@vbarbarosh/express-helpers/src/express_routes');
const express_run = require('@vbarbarosh/express-helpers/src/express_run');
const fs_path_resolve = require('@vbarbarosh/node-helpers/src/fs_path_resolve');

cli(main);

async function main()
{
    const app = express();

    app.use(express.static(fs_path_resolve(__dirname, '../..')));
    app.use(body_parser.json());

    express_routes(app, [
        {req: 'GET /', fn: echo},
        ...require('./services/black_forest_labs').routes,
        ...require('./services/thumbnailer').routes,
        ...require('./services/docker').routes,
        {req: 'ALL *', fn: page404},
    ]);

    await express_run(app);
}

async function echo(req, res)
{
    res.status(200).send(express_params(req));
}

async function page404(req, res)
{
    res.status(404).send(`Page not found: ${req.path}`);
}
