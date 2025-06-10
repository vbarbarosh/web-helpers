# Fancybox

```vue
<data-fetch v-slot="fetch" url="https://dog.ceo/api/breed/labrador/images/random/15" auto>
    <div class="flex-row flex-align-center gap10 mb15">
        <button-refresh @click="fetch.refresh" :disabled="fetch.loading" />
        <button-json :value="fetch.response" />
        <spinner v-if="fetch.loading" />
    </div>
    <fancybox v-bind:value="fetch.response?.message.map(url => ({thumbnail_url: thumbnailer(url, {w: 200}), download_url: url}))" />
</data-fetch>
```
