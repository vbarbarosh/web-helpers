# Docker Images

```vue
<vb-data-fetch v-slot="fetch" :fn="win.docker_images_list" auto>
    <vb-data-vars v-slot="vars" :vars="{selection: [], items: !fetch.response ? [] : fetch.response.map(function (v) { return {name: `${v.RepoTags[0] ?? v.RepoDigests[0]}`, containers: v.Containers, size: v.Size, item: v}; })}">
        <vb-data-filter v-slot="filter" :items="vars.items">
            <button-json :value="{selection: vars.selection, response: fetch.response}"></button-json>
            <button v-on:click="fetch.refresh">refresh</button>
            <div class="flex-row gap10">
                <div>
                    <div class="flex-row gap5">
                        <input v-model="filter.pattern">
                    </div>
                    <vb-table :selection="vars.selection" :items="filter.computed_items" :columns="[
                            {label: 'name'},
                            {label: 'containers'},
                            {label: 'size', read: v => format_bytes(v.size)},
                            {label: 'json', component: 'button-json'},
                        ]"></vb-table>
                </div>
                <div>
                </div>
            </div>
        </vb-data-filter>
    </vb-data-vars>
</vb-data-fetch>
```
