# Reset On Change (proto)

Watch a chain of dependent variables, and automatically reset
downstream variables to `null` when an upstream variable changes.

```vue
<reset-on-change v-slot="vars" :vars="{foo:1,bar:2,baz:3}" chain="foo,bar,baz">
    <div>
        <p>Foo: <input v-model="vars.foo"></p>
        <p>Bar: <input v-model="vars.bar"></p>
        <p>Baz: <input v-model="vars.baz"></p>
        <pre>{{ vars }}</pre>
    </div>
</reset-on-change>
```

## Applications

- Browsing MongoDB/MySQL/Redis
