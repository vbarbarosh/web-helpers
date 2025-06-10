app.component('data-vars', {
    emits: ['init'],
    props: ['vars', 'store'],
    render: function () {
        return this.$slots.default(this.local_vars);
    },
    data: function () {
        let vars = {};
        if (this.store) {
            try { vars = JSON.parse(localStorage.getItem(this.store) ?? {}); } catch (e) {}
        }
        return {
            local_vars: Object.assign(this.vars, vars),
        };
    },
    watch: {
        vars: function () {
            this.local_vars = this.vars;
            this.$emit('init', this.local_vars);
        },
        local_vars: {
            deep: true,
            handler: function () {
                if (this.store) {
                    localStorage.setItem(this.store, JSON.stringify(this.vars));
                }
            },
        },
    },
    created: function () {
        this.$emit('init', this.local_vars);
    }
});
