app.component('data-fetch', {
    props: ['url', 'fn', 'auto'],
    render: function () {
        return this.$slots.default(this.slot_scope);
    },
    data: function () {
        return {
            uid: null,
            response: null,
            slot_scope: {
                loading: Vue.computed(() => !!this.uid),
                response: Vue.computed(() => this.response),
                refresh: this.refresh,
            },
        };
    },
    methods: {
        refresh: async function () {
            const uid = crypto.randomUUID();
            this.uid = uid;
            try {
                const response = this.fn ? await this.fn() : await http_get_json(this.url);
                if (this.uid === uid) {
                    this.response = response;
                }
            }
            finally {
                if (this.uid === uid) {
                    this.uid = null;
                }
            }
        },
    },
    created: function () {
        if (this.auto || this.auto === '') {
            this.refresh();
        }
    },
    unmounted: function () {
    },
});
