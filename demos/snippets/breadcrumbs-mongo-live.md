# Breadcrumbs • Mongo

```vue
<data-vars v-slot="vars" :vars="{conn: null, db: null, col: null, doc: null}">
    <reset-on-change :vars="vars" chain="conn,db,col,doc" />
    <breadcrumbs :vars>
        <breadcrumbs-item value="root" label="Connections">
            <data-fetch v-slot="fetch" :fn="() => win.blocking(win.mongo_connections())" auto>
                <button-json :value="fetch.response"></button-json>
                <button-refresh @click="fetch.refresh"></button-refresh>
                <form-enum v-if="fetch.response" v-model="vars.conn" :options="fetch.response.items.map(v => ({label: v, value: v}))" label="Select MongoDB connection"></form-enum>
            </data-fetch>
            <pre>{{vars}}</pre>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.conn" label="Databases">
            <data-fetch v-slot="fetch" :fn="() => win.blocking(win.mongo_databases(vars.conn))" auto>
                <button-json :value="fetch.response"></button-json>
                <button-refresh @click="fetch.refresh"></button-refresh>
                <form-enum v-if="fetch.response" v-model="vars.db" :options="fetch.response.items.map(v => ({label: v.name, value: v.name}))" label="Select MongoDB database"></form-enum>
            </data-fetch>
            <pre>{{vars}}</pre>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.db" label="Collections">
            <data-fetch v-slot="fetch" :fn="() => win.blocking(win.mongo_collections(vars.conn, vars.db))" auto>
                <button-json :value="fetch.response"></button-json>
                <button-refresh @click="fetch.refresh"></button-refresh>
                <form-enum v-if="fetch.response" v-model="vars.col" :options="fetch.response.items.map(v => ({label: v.name, value: v.name}))" label="Select MongoDB collection"></form-enum>
            </data-fetch>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.col" label="Documents">
            <h2>Select MongoDB document</h2>
            <data-fetch v-slot="fetch" :fn="() => win.blocking(win.mongo_documents_list(vars.conn, vars.db, vars.col))" auto>
                <button-json :value="fetch.response"></button-json>
                <button-refresh @click="fetch.refresh"></button-refresh>
                <vb-table v-if="fetch.response" :items="fetch.response.items">
                    <template v-slot:actions="item">
                        <button @click="vars.doc = item">open</button>
                    </template>
                </vb-table>
            </data-fetch>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.doc" label="Document Details">
            <p>Document details</p>
            <prism-js :value="win.JSON.stringify(vars, null, 4)"></prism-js>
        </breadcrumbs-item>
    </breadcrumbs>
</data-vars>
```
