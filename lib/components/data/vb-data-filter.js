app.component('vb-data-filter', {
    props: ['items', 'prop'],
    render: function () {
        const _this = this;
        return this.$slots.default({
            get pattern() { return _this.pattern; },
            set pattern(next) { _this.pattern = next; },
            get computed_items() { return _this.computed_items; },
        });
    },
    data: function () {
        return {
            pattern: '',
        };
    },
    computed: {
        computed_items: function () {
            const prop = this.prop ?? 'name';
            const pat = this.pattern.toLowerCase();
            return this.items.filter(v => v[prop].toLowerCase().includes(pat));
        },
    },
});
