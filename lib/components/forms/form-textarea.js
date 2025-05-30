app.component('form-textarea', {
    emits: ['update:modelValue'],
    props: ['modelValue', 'label'],
    template: `
        <label class="flex-col mg5">
            <span class="form-label">{{ label }}</span>
            <textarea v-on:input="input" v-bind:value="modelValue" class="form-textarea" />
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
