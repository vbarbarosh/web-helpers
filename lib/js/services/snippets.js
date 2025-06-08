Object.assign(window, {
    snippets_list: () => http_get_json('/api/v1/snippets.json'),
});
