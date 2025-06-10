# Breadcrumbs • Mongo

```vue
<data-vars v-slot="vars" :vars="{conn: null, db: null, col: null, doc: null}">
    <reset-on-change :vars="vars" chain="conn,db,col,doc" />
    <breadcrumbs :vars>
        <breadcrumbs-item value="root" label="Connections">
            <form-enum v-model="vars.conn" :options="[
                {label: 'local', value: 'local'},
                {label: 'remote1', value: 'remote1'},
                {label: 'remote2', value: 'remote2'},
                {label: 'null', value: null},
            ]" label="Select MongoDB connection"></form-enum>
            <pre>{{vars}}</pre>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.conn" label="Databases">
            <form-enum v-model="vars.db" :options="[
                {label: 'db1', value: 'db1'},
                {label: 'db2', value: 'db2'},
                {label: 'db3', value: 'db3'}]" label="Select MongoDB database"></form-enum>
            <pre>{{vars}}</pre>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.db" label="Collections">
            <form-enum v-model="vars.col" :options="[
                {label: 'col1', value: 'col1'},
                {label: 'col2', value: 'col2'},
                {label: 'col3', value: 'col3'}]" label="Select MongoDB collection"></form-enum>
            <pre>{{vars}}</pre>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.col" label="Documents">
            <p>Select MongoDB document</p>
            <form-enum v-model="vars.doc" :options="[
                {label: 'doc1', value: 'doc1'},
                {label: 'doc2', value: 'doc2'},
                {label: 'doc3', value: 'doc3'}]" label="Select MongoDB document"></form-enum>
            <pre>{{vars}}</pre>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.doc" label="Document Details">
            <p>Document details</p>
            <pre>{{ vars }}</pre>
        </breadcrumbs-item>
    </breadcrumbs>
</data-vars>
```
