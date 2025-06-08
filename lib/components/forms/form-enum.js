app.component('form-enum', {
    emits: ['update:modelValue'],
    props: ['modelValue', 'label', 'options'],
    template: `
        <label class="flex-col mg5">
            <span class="form-label">{{ label }}</span>
            <select v-on:input="input" v-bind:value="modelValue">
                <option v-for="option in options" v-bind:value="option.value">
                    {{ option.label }}
                </option>
            </select>
        </label>
    `,
    data: function () {
        return {};
    },
    computed: {
    },
    watch: {
    },
    methods: {
        input: function (event) {
            this.$emit('update:modelValue', event.currentTarget.value);
        },
    },
    created: function () {
    },
    unmounted: function () {
    },
});
