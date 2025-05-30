app.component('vb-data-fetch', {
    props: ['url', 'auto'],
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
                const response = await http_get_json(this.url);
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
        console.log('vb-data-fetch---created');
    },
    unmounted: function () {
        console.log('vb-data-fetch---unmounted');
    },
});
