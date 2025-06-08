# Modals

```vue
<div class="iflex-col gap5">
    <button-transparent v-on:click="win.setTimeout(win.modal_blocking().return, 1000)">modal-blocking</button-transparent>
    <button-transparent v-on:click="win.modal_error({error: {message: 'ggg'}})">modal-error</button-transparent>
    <button-transparent v-on:click="win.modal_hello()">modal-hello</button-transparent>
    <button-transparent v-on:click="win.modal_json({foo: 1, bar: 2})">modal-json</button-transparent>
</div>
```
