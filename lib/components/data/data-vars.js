app.component('data-vars', {
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
    watch: {
        vars: function () {
            this.local_vars = this.vars;
            this.$emit('init', this.local_vars);
        },
    },
    created: function () {
        this.$emit('init', this.local_vars);
    }
});
