# Docker Containers

```vue
<vb-data-fetch v-slot="fetch" :fn="win.docker_containers_list" auto>
    <vb-data-vars v-slot="vars" :vars="{selection: [], items: !fetch.response ? [] : fetch.response.map(function (v) { return {name: `${v.Labels['com.docker.compose.project']} • ${v.Labels['com.docker.compose.service']}`, status: '', network: '', item: v}; })}">
        <vb-data-filter v-slot="filter" :items="vars.items">
            <button-json :value="fetch.response"></button-json>
            <button-json :value="vars.selection"></button-json>
            <button v-on:click="fetch.refresh">refresh</button>
            <div class="flex-row gap10">
                <div>
                    <div class="flex-row gap5">
                        <input v-model="filter.pattern">
                        <button v-on:click="win.blocking(win.Promise.all(vars.selection.map(v => win.docker_containers_restart(v.item.Id))).then(fetch.refresh))">restart [{{ vars.selection.length }}]</button>
                        <button v-on:click="win.blocking(win.Promise.all(vars.selection.map(v => win.docker_containers_pause(v.item.Id))).then(fetch.refresh))">pause [{{ vars.selection.length }}]</button>
                        <button v-on:click="win.blocking(win.Promise.all(vars.selection.map(v => win.docker_containers_unpause(v.item.Id))).then(fetch.refresh))">unpause [{{ vars.selection.length }}]</button>
                        <button v-on:click="win.blocking(win.Promise.all(vars.selection.map(v => win.docker_containers_remove(v.item.Id))).then(fetch.refresh))">delete [{{ vars.selection.length }}]</button>
                    </div>
                    <vb-table :selection="vars.selection" :items="filter.computed_items" :columns="[
                            {label: 'name'},
                            {label: 'status', read: v => v.item, component: 'docker-container-status'},
                            {label: 'network', read: v => v.item, component: 'docker-container-network'},
                        ]"></vb-table>
                </div>
                <div class="mg15">
                    <vb-data-fetch v-slot="fetch" :fn="win.docker_info" auto>
                        <div class="flex-row gap10">
                            <button-json :value="fetch.response"></button-json>
                            <button v-on:click="fetch.refresh">refresh</button>
                            <spinner v-if="fetch.loading"></spinner>
                        </div>
                        <table v-if="fetch.response">
                            <tbody>
                            <tr><th>Containers</th><td>{{ fetch.response.Containers }}</td></tr>
                            <tr><th>ContainersRunning</th><td>{{ fetch.response.ContainersRunning }}</td></tr>
                            <tr><th>ContainersPaused</th><td>{{ fetch.response.ContainersPaused }}</td></tr>
                            <tr><th>ContainersStopped</th><td>{{ fetch.response.ContainersStopped }}</td></tr>
                            <tr><th>Images</th><td>{{ fetch.response.Images }}</td></tr>
                            <tr><th>NCPU</th><td>{{ fetch.response.NCPU }}</td></tr>
                            <tr><th>MemTotal</th><td>{{ format_bytes(fetch.response.MemTotal) }}</td></tr>
                            <tr><th>DockerRootDir</th><td>{{ fetch.response.DockerRootDir }}</td></tr>
                            <tr><th>ServerVersion</th><td>{{ fetch.response.ServerVersion }}</td></tr>
                            </tbody>
                        </table>
                    </vb-data-fetch>
                </div>
            </div>
        </vb-data-filter>
    </vb-data-vars>
</vb-data-fetch>
```
