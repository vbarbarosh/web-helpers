app.component('form-enum', {
    emits: ['update:modelValue'],
    props: ['modelValue', 'label', 'options'],
    template: `
        <label class="flex-col mg5">
            <span class="form-label">{{ label }}</span>
            <select v-model="computed_value">
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
        computed_value: {
            get: function () {
                return this.modelValue;
            },
            set: function (next) {
                this.$emit('update:modelValue', next);
            },
        },
    },
    watch: {
    },
    methods: {
    },
    created: function () {
    },
    unmounted: function () {
    },
});
