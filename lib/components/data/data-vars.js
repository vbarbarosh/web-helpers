app.component('data-vars', {
    emits: ['init'],
    // ignore -> omit
    props: ['vars', 'store', 'ignore', 'storeOnly'],
    render: function () {
        return this.$slots.default(this.local_vars);
    },
    data: function () {
        return {
            local_vars: {},
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
                if (!this.store) {
                    return;
                }
                const save = {};
                if (this.storeOnly) {
                    this.storeOnly.split(',').forEach(key => save[key] = this.local_vars[key]);
                }
                else {
                    Object.assign(save, this.local_vars);
                    if (this.ignore) {
                        this.ignore.split(',').forEach(key => delete save[key]);
                    }
                }
                localStorage.setItem(this.store, JSON.stringify(save));
            },
        },
    },
    methods: {
        refresh: function () {
            const vars = Object.assign({}, this.vars);
            if (this.store) {
                try {
                    const tmp = JSON.parse(localStorage.getItem(this.store) ?? '{}');
                    if (this.storeOnly) {
                        this.storeOnly.split(',').forEach(key => vars[key] = tmp[key]);
                    }
                    else {
                        if (this.ignore) {
                            this.ignore.split(',').forEach(key => delete tmp[key])
                        }
                        Object.assign(vars, tmp);
                    }
                }
                catch (error) {
                }
            }
            this.local_vars = vars;
        },
    },
    created: function () {
        this.refresh();
        this.$emit('init', this.local_vars);
    }
});
