app.component('reset-on-change', {
    props: ['vars', 'chain'],
    render: function () {
        if (!this.$slots.default) {
            return null;
        }
        return this.$slots.default(this.local_vars);
    },
    data: function () {
        return {
            local_vars: this.vars,
        };
    },
    computed: {
        computed_chain: function () {
            if (typeof this.chain === 'string') {
                return this.chain.split(',');
            }
            return this.chain;
        },
    },
    created: function () {
        const _this = this;
        // this.state = Object.fromEntries(this.computed_chain.map(v => [v, null]));
        this.computed_chain.forEach(function (key, index) {
            if (index === _this.computed_chain.length - 1) {
                return;
            }
            const deps = _this.computed_chain.slice(index + 1);
            _this.$watch(() => _this.local_vars[key], function () {
                deps.forEach(v => _this.local_vars[v] = null);
            });
        });
    },
});
