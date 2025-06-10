# Forms • Basic

```vue
<data-vars v-slot="vars" :vars="{form: {}}">
    <div class="flex-row gap15">
        <div>
            <form-string v-model="vars.form.first_name" label="First Name"></form-string>
            <form-string v-model="vars.form.last_name" label="Last Name"></form-string>
            <form-int v-model="vars.form.age" label="Age"></form-int>
            <form-enum v-model="vars.form.gender" label="Gender" :options="[
                {label: 'Male', value: 'male'},
                {label: 'Female', value: 'female'},
            ]"></form-enum>
        </div>
        <div class="flex-fluid">
            <pre>{{ vars }}</pre>
        </div>
    </div>
</data-vars>
```
