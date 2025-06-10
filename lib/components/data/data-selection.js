app.component('data-selection', {
    emits: ['init'],
    props: ['items', 'pk', 'store'],
    render: function () {
        return this.$slots.default(this.local_vars);
    },
    data: function () {
        let ids = [];
        if (this.store) {
            try { ids = JSON.parse(localStorage.getItem(this.store) ?? '[]'); } catch (e) {}
        }
        return {
            ids,
            selection: [],
            local_vars: {
                selection: Vue.computed(() => this.selection),
            },
        };
    },
    watch: {
        items: {
            immediate: true,
            handler: function () {
                if (!this.items) {
                    return;
                }
                const map = new Map(this.items.map(v => [v[this.pk], v]));
                const fresh = this.ids.map(id => map.get(id)).filter(v => v);
                this.selection.splice(0, this.selection.length, ...fresh);
            },
        },
        selection: {
            deep: true,
            handler: function () {
                this.ids = this.selection.map(v => v[this.pk]);
                if (this.store) {
                    localStorage.setItem(this.store, JSON.stringify(this.ids));
                }
            },
        },
    },
});
