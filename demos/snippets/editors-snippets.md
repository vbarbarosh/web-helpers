# Snippets Editor

```vue
<data-vars v-slot="vars" :vars="{
        current: null,
        snippets: [
            {name: 'spinner', body: '<spinner></spinner>\n'},
        ],
    }" v-on:init="v => v.current = v.snippets[0]">
    <button-json :value="vars" />
    <div class="hsplit">
        <div class="mg25">
            <input v-model="vars.current.name" type="text" />
            <form-textarea v-model="vars.current.body" />
            <button-green v-on:click="vars.snippets.unshift(vars.current = {name: '', body: ''})">New</button-green>
        </div>
        <div class="max-w400">
            <ul>
                <li v-for="item in vars.snippets" @click="vars.current = item" :class="{yellow: (vars.current === item)}" class="cur-pointer">
                    {{ item.name }}
                </li>
            </ul>
        </div>
    </div>
    <live-vue :value="vars.current.body" />
</data-vars>
```
