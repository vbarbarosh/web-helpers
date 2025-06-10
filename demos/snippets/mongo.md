# Mongo

```vue
<data-vars v-slot="vars" :vars="{db: null}">
    <data-fetch v-slot="fetch_db" :fn="() => win.mongo_databases('local')" auto>
        <data-fetch v-slot="fetch_col" :fn="() => win.mongo_collections('local', vars.db)">
            <button-json :value="fetch_db.response" />
            <template v-if="fetch_db.response">
                <vb-table :items="fetch_db.response.items" :columns="[
                    {label: 'name'},
                    {label: 'collections', read: v => v.stats.collections},
                    {label: 'objects', read: v => v.stats.objects},
                    {label: '', slot: 'open'},
                    {component: 'button-json'},
                ]">
                    <template v-slot:open="slot">
                        <button v-on:click="() => {vars.db = slot.item.name; fetch_col.refresh()}">open</button>
                    </template>
                </vb-table>
            </template>
            <template v-if="fetch_col.response">
                <button-json :value="fetch_col.response" />
                <vb-table :items="fetch_col.response.items" />
            </template>
        </data-fetch>
    </data-fetch>
</data-vars>
```
