# Breadcrumbs • Mongo

```vue
<data-vars v-slot="vars" :vars="{conn: null, db: null, col: null, doc: null}" store="snip/mongo">
    <reset-on-change :vars="vars" chain="conn,db,col,doc" />
    <breadcrumbs :vars>
        <breadcrumbs-item value="root" label="Connections">
            <data-fetch v-slot="fetch" :fn="() => win.blocking(win.mongo_connections())" auto>
                <div class="flex-row-center-left gap10">
                    <button-json :value="fetch.response" />
                    <button-refresh @click="fetch.refresh" />
                </div>
                <form-enum v-if="fetch.response" v-model="vars.conn" :options="fetch.response.items.map(v => ({label: v, value: v}))" label="Select MongoDB connection"></form-enum>
            </data-fetch>
            <pre>{{vars}}</pre>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.conn" label="Databases">
            <data-fetch v-slot="fetch" :fn="() => win.blocking(win.mongo_databases(vars.conn))" auto>
                <div class="flex-row-center-left gap10">
                    <button-json :value="fetch.response" />
                    <button-refresh @click="fetch.refresh" />
                    <button>Create Database</button>
                </div>
                <form-enum v-if="fetch.response" v-model="vars.db" :options="fetch.response.items.map(v => ({label: v.name, value: v.name}))" label="Select MongoDB database"></form-enum>
            </data-fetch>
            <pre>{{vars}}</pre>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.db" label="Collections">
            <data-fetch v-slot="fetch" :fn="() => win.blocking(win.mongo_collections(vars.conn, vars.db))" auto>
                <div class="flex-row-center-left gap10">
                    <button-json :value="fetch.response" />
                    <button-refresh @click="fetch.refresh" />
                    <button v-on:click="() => win.modal_mongo_collections_create(vars).promise().then(v => v && (vars.col = v.name))">Create Collection</button>
                    <button v-on:click="() => win.modal_mongo_collections_remove(vars).promise().then(v => v && (vars.col = null, fetch.refresh()))">Drop Collection</button>
                </div>
                <form-enum v-if="fetch.response" v-model="vars.col" :options="fetch.response.items.map(v => ({label: v.name, value: v.name}))" label="Select MongoDB collection"></form-enum>
            </data-fetch>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.col" label="Documents">
            <data-fetch v-slot="fetch" :fn="() => win.blocking(win.mongo_documents_list(vars.conn, vars.db, vars.col))" auto>
                <div class="flex-row-center-left gap10">
                    <button-json :value="fetch.response" />
                    <button-refresh @click="fetch.refresh" />
                    <button v-on:click="() => win.modal_mongo_documents_create(vars).promise().then(v => v && (vars.col = v.name))">Create Document</button>
                    <button v-on:click="() => win.modal_mongo_documents_remove(vars).promise().then(v => v && (vars.col = null, fetch.refresh()))">Drop Document</button>
                </div>
                <vb-table v-if="fetch.response" :items="fetch.response.items">
                    <template v-slot:actions="{item}">
                        <button @click="vars.doc = item._id">open</button>
                    </template>
                </vb-table>
            </data-fetch>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.doc" label="Document Details">
            <p>Document details</p>
            <data-fetch v-slot="fetch" :fn="() => win.blocking(win.mongo_documents_fetch(vars.conn, vars.db, vars.col, vars.doc))" auto>
                <div class="flex-row-center-left gap10">
                    <button-json :value="fetch.response" />
                    <button-refresh @click="fetch.refresh" />
                </div>
                <prism-js :value="win.JSON.stringify(fetch.response, null, 4)" />
            </data-fetch>
        </breadcrumbs-item>
    </breadcrumbs>
</data-vars>
```
