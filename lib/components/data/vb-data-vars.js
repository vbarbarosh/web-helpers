app.component('vb-data-vars', {
    emits: ['init'],
    props: ['vars'],
    render: function () {
        return this.$slots.default(this.local_vars);
    },
    data: function () {
        return {
            local_vars: this.vars,
        };
    },
    created: function () {
        this.$emit('init', this.vars);
    }
});
