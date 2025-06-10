# Mongo • Basics

```vue
<data-fetch v-slot="fetch" :fn="() => win.mongo_documents_list('local', 'hello', 'docs')" auto>
    <div class="flex-row flex-align-center gap10">
        <button-blue @click="() => win.blocking(win.mongo_documents_create('local', 'hello', 'docs', {random: Math.random(), time: new Date()}).then(fetch.refresh))">Create Document</button-blue>
        <button-refresh @click="fetch.refresh" />
        <button-json :value="fetch.response" />
    </div>
    <div class="mb15" />
    <template v-if="fetch.response?.items">
        <vb-table :items="fetch.response.items">
            <template v-slot:actions="{item}">
                <button @click="() => win.blocking(win.mongo_documents_remove('local', 'hello', 'docs', item._id).then(fetch.refresh))">remove</button>
                <button @click="() => win.blocking(win.mongo_documents_replace('local', 'hello', 'docs', {...item, random: Math.random(), time: new Date()}).then(fetch.refresh))">replace</button>
            </template>
        </vb-table>
    </template>
</data-fetch>
```
