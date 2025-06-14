app.component('s3-buckets-remove', {
    emits: ['change'],
    props: ['items', 'vars'],
    template: `
        <button v-on:click="click" v-bind:disabled="!items.length">
            {{ plural(items.length, 'Delete # bucket', 'Delete # buckets', 'Delete', 'Delete') }}
        </button>
    `,
    methods: {
        click: async function () {
            const {items} = this;
            const {conn} = this.vars;
            await blocking(async function (status) {
                for (let i = 0; i < items.length; ++i) {
                    status(`${i} of ${items.length}`);
                    await s3_buckets_remove(conn, items[i].Name);
                }
                status('Done 🎉');
            });
            this.$emit('change');
        },
    },
});
