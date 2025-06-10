# Tables

```vue
<data-fetch v-slot="fetch" url="https://randomuser.me/api/?results=10" auto>
    <div class="flex-row flex-align-center gap10 mb15">
        <button-refresh v-on:click="fetch.refresh" :disabled="fetch.loading" />
        <button-json :value="fetch.response" />
        <spinner v-if="fetch.loading" />
    </div>
    <vb-table :items="fetch.response?.results" :columns="[
            {label: 'picture', slot: 'picture'},
            {label: 'id', read: v => v.id.value},
            {label: 'gender', read: v => v.gender},
            {label: 'nat', read: v => v.nat},
            {label: 'name', read: v => `${v.name.title} ${v.name.first} ${v.name.last}`},
            {label: 'email', read: v => v.email},
            {component: 'button-json'},
        ]">
        <template v-slot:picture="{item}">
            <img :src="thumbnailer(item.picture.large, {w: 50})" alt="" />
        </template>
    </vb-table>
</data-fetch>
```
