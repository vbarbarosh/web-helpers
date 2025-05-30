app.component('vb-data-vars', {
    props: ['vars'],
    render: function () {
        return this.$slots.default(this.local_vars);
    },
    data: function () {
        return {
            local_vars: this.vars,
        };
    },
});
