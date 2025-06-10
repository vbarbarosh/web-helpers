# Breadcrumbs • Mongo

```vue
<vb-data-vars v-slot="vars" :vars="{conn: null, db: null, col: null, doc: null}">
    <reset-on-change :vars="vars" chain="conn,db,col,doc">
        <breadcrumbs :vars>
            <breadcrumbs-item value="root" label="Connections">
                <vb-data-fetch v-slot="fetch" :fn="() => win.blocking(win.mongo_connections())" auto>
                    <button-json :value="fetch.response"></button-json>
                    <button-refresh @click="fetch.refresh"></button-refresh>
                    <form-enum v-if="fetch.response" v-model="vars.conn" :options="fetch.response.items.map(v => ({label: v, value: v}))" label="Select MongoDB connection"></form-enum>
                </vb-data-fetch>
                <pre>{{vars}}</pre>
            </breadcrumbs-item>
            <breadcrumbs-item :value="vars.conn" label="Databases">
                <vb-data-fetch v-slot="fetch" :fn="() => win.blocking(win.mongo_databases(vars.conn))" auto>
                    <button-json :value="fetch.response"></button-json>
                    <button-refresh @click="fetch.refresh"></button-refresh>
                    <form-enum v-if="fetch.response" v-model="vars.db" :options="fetch.response.items.map(v => ({label: v.name, value: v.name}))" label="Select MongoDB database"></form-enum>
                </vb-data-fetch>
                <pre>{{vars}}</pre>
            </breadcrumbs-item>
            <breadcrumbs-item :value="vars.db" label="Collections">
                <vb-data-fetch v-slot="fetch" :fn="() => win.blocking(win.mongo_collections(vars.conn, vars.db))" auto>
                    <button-json :value="fetch.response"></button-json>
                    <button-refresh @click="fetch.refresh"></button-refresh>
                    <form-enum v-if="fetch.response" v-model="vars.col" :options="fetch.response.items.map(v => ({label: v.name, value: v.name}))" label="Select MongoDB collection"></form-enum>
                </vb-data-fetch>
            </breadcrumbs-item>
            <breadcrumbs-item :value="vars.col" label="Documents">
                <h2>Select MongoDB document</h2>
                <vb-data-fetch v-slot="fetch" :fn="() => win.blocking(win.mongo_documents_list(vars.conn, vars.db, vars.col))" auto>
                    <button-json :value="fetch.response"></button-json>
                    <button-refresh @click="fetch.refresh"></button-refresh>
                    <vb-table v-if="fetch.response" :items="fetch.response.items">
                        <template v-slot:actions="item">
                            <button @click="vars.doc = item">open</button>
                        </template>
                    </vb-table>
                </vb-data-fetch>
            </breadcrumbs-item>
            <breadcrumbs-item :value="vars.doc" label="Document Details">
                <p>Document details</p>
                <vb-prism-js :value="win.JSON.stringify(vars, null, 4)"></vb-prism-js>
            </breadcrumbs-item>
        </breadcrumbs>
    </reset-on-change>
</vb-data-vars>
```
