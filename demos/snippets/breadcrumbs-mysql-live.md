# Breadcrumbs • MySQL

```vue
<data-vars v-slot="vars" :vars="{conn: null, table: null}" store="snip/mysql" store-only="conn,table">
    <reset-on-change :vars="vars" chain="conn,table" />
    <breadcrumbs :vars>
        <breadcrumbs-item value="root" label="Connections">
            <data-fetch v-slot="fetch" :fn="() => win.blocking(win.mysql_connections_list())" auto>
                <div class="flex-row-center-left gap10">
                    <button-json :value="fetch.response" />
                    <button-refresh @click="fetch.refresh" />
                </div>
                <form-enum v-if="fetch.response" v-model="vars.conn" :options="fetch.response.items.map(v => ({label: v, value: v}))" label="Select S3 Connect"></form-enum>
            </data-fetch>
            <pre>{{vars}}</pre>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.conn" label="Tables">
            <data-fetch v-slot="fetch" :fn="() => win.blocking(win.mysql_tables_list(vars.conn))" auto>
                <div class="flex-row-center-left gap10">
                    <button-json :value="fetch.response" />
                    <button-refresh @click="fetch.refresh" />
                    <button @click="() => win.modal_mysql_tables_create(vars).promise().then(v => v && win.blocking(fetch.refresh).then(() => vars.table = v.table))">Create Table</button>
                </div>
                <vb-table v-if="fetch.response" :items="fetch.response.rows" :columns="[
                        {label: 'TABLE_NAME'},
                        {label: 'TABLE_TYPE'},
                        {label: 'ENGINE'},
                        {label: 'TABLE_ROWS', read: item => format_thousands(item.TABLE_ROWS), class: 'r'},
                        {label: 'DATA_LENGTH', read: item => format_bytes(item.DATA_LENGTH)},
                        {label: 'INDEX_LENGTH', read: item => format_bytes(item.INDEX_LENGTH)},
                        {label: 'AUTO_INCREMENT'},
                        {label: 'TABLE_COLLATION'},
                        ]">
                    <template v-slot:actions="{item}">
                        <button-json :value="item" />
                        <button @click="vars.table = item.TABLE_NAME">open</button>
                    </template>
                </vb-table>
            </data-fetch>
            <pre>{{vars}}</pre>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.table" label="Rows">
            <data-fetch v-slot="fetch" :fn="() => win.blocking(win.mysql_rows_list(vars.conn, vars.table))" auto>
                <data-selection v-slot="{selection}" :items="fetch.response?.rows" pk="id">
                    <div class="flex-row-center-left gap10 white sticky-t bs5">
                        <button-json :value="fetch.response" />
                        <button-refresh @click="fetch.refresh" />
                        <button-selection :value="selection" />
                    </div>
                    <vb-table v-if="fetch.response" :selection :items="fetch.response.rows" />
                </data-selection>
            </data-fetch>
            <pre>{{vars}}</pre>
        </breadcrumbs-item>
    </breadcrumbs>
</data-vars>
```
