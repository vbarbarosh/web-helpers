# Breadcrumbs • S3

```vue
<data-vars v-slot="vars" :vars="{conn: null, bucket: null, files: [], Prefix: '', Marker: ''}" store="snip/s3" store-only="conn,bucket">
    <reset-on-change :vars="vars" chain="conn,bucket" />
    <breadcrumbs :vars>
        <breadcrumbs-item value="root" label="Connections">
            <data-fetch v-slot="fetch" :fn="() => win.blocking(win.s3_connections_list())" auto>
                <div class="flex-row-center-left gap10">
                    <button-json :value="fetch.response" />
                    <button-refresh @click="fetch.refresh" />
                </div>
                <form-enum v-if="fetch.response" v-model="vars.conn" :options="fetch.response.items.map(v => ({label: v, value: v}))" label="Select S3 Connect"></form-enum>
            </data-fetch>
            <pre>{{vars}}</pre>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.conn" label="Buckets">
            <data-fetch v-slot="fetch" :fn="() => win.blocking(win.s3_buckets_list(vars.conn))" auto>
                <div class="flex-row-center-left gap10">
                    <button-json :value="fetch.response" />
                    <button-refresh @click="fetch.refresh" />
                    <button @click="() => win.modal_s3_buckets_create(vars).promise().then(v => v && win.blocking(fetch.refresh).then(() => vars.bucket = v.Bucket))">Create Bucket</button>
                </div>
                <vb-table v-if="fetch.response" :items="fetch.response.items" :columns="[{label: 'Name'}, {label: 'CreationDate'}]">
                    <template v-slot:actions="{item}">
                        <button-json :value="item" />
                        <button @click="vars.bucket = item.Name">open</button>
                        <s3-buckets-remove @change="() => fetch.refresh().then(() => vars.bucket = null)" :items="[item]" :vars />
                    </template>
                </vb-table>
            </data-fetch>
            <pre>{{vars}}</pre>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.bucket" label="Objects">
            <data-fetch v-slot="fetch" :fn="() => win.blocking(win.s3_objects_list(vars.conn, vars.bucket, vars.Prefix, vars.Marker))" auto>
                <data-selection v-slot="{selection}" :items="fetch.response?.Contents" pk="Key">
                    <div class="flex-row-center-left gap10 white bs5 sticky-t">
                        <button-json :value="fetch.response" />
                        <button-refresh @click="fetch.refresh" />
                        <s3-objects-remove @change="fetch.refresh" :items="selection" :vars />
                    </div>
                    <div class="w400">
                        <form-string v-model="vars.Prefix" label="Prefix" />
                    </div>
                    <vb-table v-if="fetch.response" :selection :items="fetch.response.Contents" :columns="[{label: 'Key'}, {label: 'Size'}, {label: 'type', read: v => v.Head.ContentType}, {label: 'LastModified'}]">
                        <template v-slot:actions="{item}">
                            <button-json :value="item" />
                            <button @click="() => win.blocking(win.s3_objects_sign_get(vars.conn, vars.bucket, item.Key)).then(v => win.modal_json(v).promise())">open</button>
                            <button @click="() => win.blocking(win.s3_objects_remove(vars.conn, vars.bucket, item.Key).then(fetch.refresh))">delete</button>
                        </template>
                    </vb-table>
                    <div v-if="fetch.response" class="flex-row-center-left gap5">
                        <button @click="() => {vars.Marker = ''; fetch.refresh()}"
                                v-bind:disabled="!vars.Marker">
                            Reset
                        </button>
                        <button @click="() => {vars.Marker = fetch.response.NextMarker; fetch.refresh()}"
                                v-bind:disabled="!fetch.response.NextMarker">
                            Next
                        </button>
                    </div>
                    <form-files-drop-zone v-model="vars.files" limit="100" />
                    <s3-objects-replace @change="() => win.blocking(fetch.refresh).then(() => vars.files = [])" :items="vars.files" :vars />
                    <vb-table v-if="vars.files" :items="vars.files" :columns="[{label: 'name'}, {label: 'size'}, {label: 'fullPath'}]">
                        <template v-slot:actions="{item}">
                            <s3-objects-replace @change="fetch.refresh" :items="[item]" :vars />
                            <button @click="() => vars.files = vars.files.filter(v => v !== item)">Exclude</button>
                        </template>
                    </vb-table>
                </data-selection>
            </data-fetch>
        </breadcrumbs-item>
    </breadcrumbs>
</data-vars>
```
