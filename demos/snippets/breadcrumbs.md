# Breadcrumbs

```vue
<vb-data-vars v-slot="vars" :vars="{foo: null, bar: null, baz: null}">
    <reset-on-change :vars chain="foo,bar,baz"></reset-on-change>
    <breadcrumbs>
        <breadcrumbs-item value="root" label="Foo">
            <p>Ipsum minus nemo odit omnis praesentium tempora? Aliquid amet autem commodi id ipsum quaerat quasi, quos ratione repellat sit ullam voluptates voluptatibus.</p>
            <select v-model="vars.foo">
                <option>foo1</option>
                <option>foo2</option>
                <option>foo3</option>
            </select>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.foo" label="Bar">
            <p>Commodi, corporis debitis dicta expedita incidunt ipsam nulla! A ab, autem, dignissimos ducimus et hic inventore nulla optio placeat, praesentium quisquam suscipit?</p>
            <select v-model="vars.bar">
                <option>bar1</option>
                <option>bar2</option>
                <option>bar3</option>
            </select>
        </breadcrumbs-item>
        <breadcrumbs-item :value="vars.bar" label="Baz">
            <p>Necessitatibus non recusandae repellat vitae? Aliquam ea esse expedita harum illum in magni odit officiis, quaerat ratione? Consequuntur.</p>
            <select v-model="vars.baz">
                <option>baz1</option>
                <option>baz2</option>
                <option>baz3</option>
            </select>
        </breadcrumbs-item>
    </breadcrumbs>
</vb-data-vars>
```
