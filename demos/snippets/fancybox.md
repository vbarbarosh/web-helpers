# Fancybox

```vue
<vb-data-fetch v-slot="fetch" url="https://dog.ceo/api/breed/labrador/images/random/15" auto>
    <div class="flex-row flex-align-center gap10 mb15">
        <button-transparent v-on:click="fetch.refresh" :disabled="fetch.loading">
            Refresh
        </button-transparent>
        <button-json :value="fetch.response"></button-json>
        <spinner v-if="fetch.loading"></spinner>
    </div>
    <fancybox v-bind:value="fetch.response?.message.map(url => ({thumbnail_url: thumbnailer(url, {w: 200}), download_url: url}))"></fancybox>
</vb-data-fetch>
```
