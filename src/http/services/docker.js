const http = require('node:http');
const urlmod = require('@vbarbarosh/node-helpers/src/urlmod');

// https://docs.docker.com/reference/api/engine/version/v1.39/#tag/Container/operation/ContainerList

const routes = [
    {req: 'GET /api/v1/docker/info', fn: docker_info},
    {req: 'GET /api/v1/docker/version', fn: docker_version},
    {req: 'GET /api/v1/docker/ping', fn: docker_ping},
    {req: 'GET /api/v1/docker/events', fn: docker_events},
    {req: 'GET /api/v1/docker/images.json', fn: docker_images_list},
    {req: 'GET /api/v1/docker/images/:image_id.json', fn: docker_images_fetch},
    {req: 'GET /api/v1/docker/images/:image_id/history', fn: docker_images_history},
    {req: 'GET /api/v1/docker/containers.json', fn: docker_containers_list},
    {req: 'GET /api/v1/docker/containers/:container_id.json', fn: docker_containers_fetch},
    {req: 'GET /api/v1/docker/containers/:container_id/top', fn: docker_containers_top},
    {req: 'GET /api/v1/docker/containers/:container_id/logs', fn: docker_containers_logs},
    {req: 'GET /api/v1/docker/containers/:container_id/stats', fn: docker_containers_stats},
    {req: 'POST /api/v1/docker/containers/:container_id/start', fn: docker_containers_start},
    {req: 'POST /api/v1/docker/containers/:container_id/stop', fn: docker_containers_stop},
    {req: 'POST /api/v1/docker/containers/:container_id/restart', fn: docker_containers_restart},
    {req: 'POST /api/v1/docker/containers/:container_id/kill', fn: docker_containers_kill},
    {req: 'POST /api/v1/docker/containers/:container_id/pause', fn: docker_containers_pause},
    {req: 'POST /api/v1/docker/containers/:container_id/unpause', fn: docker_containers_unpause},
    {req: 'DELETE /api/v1/docker/containers/:container_id', fn: docker_containers_remove},
];

// GET /api/v1/docker/info
async function docker_info(req, res)
{
    res.send(await docker_api('GET', '/info'));
}

// GET /api/v1/docker/version
async function docker_version(req, res)
{
    res.send(await docker_api('GET', '/version'));
}

// GET /api/v1/docker/ping
async function docker_ping(req, res)
{
    res.send(await docker_api('GET', '/_ping'));
}

// GET /api/v1/docker/events
async function docker_events(req, res)
{
    const {since, until, filters} = req.query;
    res.send(await docker_api('GET', urlmod('/events', {since, until, filters})));
}

// GET /api/v1/docker/images.json
async function docker_images_list(req, res)
{
    res.send(await docker_api('GET', urlmod('/images/json?all=true')));
}

// GET /api/v1/docker/images/:image_id.json
async function docker_images_fetch(req, res)
{
    res.send(await docker_api('GET', urlmod(`/images/${req.params.image_id}/json`)));
}

// GET /api/v1/docker/images/:image_id/history
async function docker_images_history(req, res)
{
    res.send(await docker_api('GET', urlmod(`/images/${req.params.image_id}/history`)));
}

// GET /api/v1/docker/containers.json
async function docker_containers_list(req, res)
{
    res.send(await docker_api('GET', '/containers/json?all=true'));
}

// GET /api/v1/docker/containers/:container_id.json
async function docker_containers_fetch(req, res)
{
    res.send(await docker_api('GET', `/containers/${req.params.container_id}/json?size=true`));
}

// GET /api/v1/docker/containers/:container_id/top
async function docker_containers_top(req, res)
{
    const {ps_args} = req.query.ps_args;
    res.send(await docker_api('GET', urlmod(`/containers/${req.params.container_id}/top`, {ps_args})));
}

// GET /api/v1/docker/containers/:container_id/logs
async function docker_containers_logs(req, res)
{
    const {follow, stdout, stderr, since, until, timestamps, tail} = req.query;
    res.send(await docker_api('GET', urlmod(`/containers/${req.params.container_id}/logs`, {follow, stdout, stderr, since, until, timestamps, tail})));
}

// GET /api/v1/docker/containers/:container_id/stats
async function docker_containers_stats(req, res)
{
    const {stream} = req.query;
    res.send(await docker_api('GET', urlmod(`/containers/${req.params.container_id}/stats`, {stream})));
}

// POST /api/v1/docker/containers/:container_id/start
async function docker_containers_start(req, res)
{
    const {detachKeys} = req.body ?? {};
    res.send(await docker_api('POST', `/containers/${req.params.container_id}/start`, {detachKeys}));
}

// POST /api/v1/docker/containers/:container_id/stop
async function docker_containers_stop(req, res)
{
    const {t} = req.body ?? {};
    res.send(await docker_api('POST', `/containers/${req.params.container_id}/stop`, {t}));
}

// POST /api/v1/docker/containers/:container_id/restart
async function docker_containers_restart(req, res)
{
    const {t} = req.body ?? {};
    res.send(await docker_api('POST', `/containers/${req.params.container_id}/restart`, {t}));
}

// POST /api/v1/docker/containers/:container_id/kill
async function docker_containers_kill(req, res)
{
    const {signal} = req.body ?? {};
    res.send(await docker_api('POST', `/containers/${req.params.container_id}/kill`, {signal}));
}

// POST /api/v1/docker/containers/:container_id/pause
async function docker_containers_pause(req, res)
{
    res.send(await docker_api('POST', `/containers/${req.params.container_id}/pause`));
}

// POST /api/v1/docker/containers/:container_id/unpause
async function docker_containers_unpause(req, res)
{
    res.send(await docker_api('POST', `/containers/${req.params.container_id}/unpause`));
}

// DELETE /api/v1/docker/containers/:container_id
async function docker_containers_remove(req, res)
{
    res.send(await docker_api('DELETE', `/containers/${req.params.container_id}`));
}

function docker_api(method, path, body = null)
{
    const options = {
        method,
        path,
        socketPath: '/var/run/docker.sock',
        headers: {},
    };

    const buf = !body ? null : Buffer.from(JSON.stringify(body));
    if (buf) {
        options.headers['Content-Type'] = 'application/json';
        options.headers['Content-Length'] = buf.length;
    }

    return new Promise(function (resolve, reject) {
        const req = http.request(options, async function (res) {
            try {
                const chunks = await res.toArray();
                const json = Buffer.concat(chunks).toString();
                json ? resolve(JSON.parse(json)) : resolve();
            }
            catch (error) {
                reject(error);
            }
        });
        req.on('error', reject);
        if (buf) {
            req.write(buf);
        }
        req.end();
    });
}

module.exports = {routes};
