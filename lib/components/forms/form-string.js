app.component('form-string', {
    emits: ['update:modelValue'],
    props: ['modelValue', 'label'],
    template: `
        <label class="flex-col mg5">
            <span class="form-label">{{ label }}</span>
            <input v-on:input="input" v-bind:value="modelValue" type="text" />
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
