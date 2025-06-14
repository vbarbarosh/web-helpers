app.component('s3-objects-remove', {
    emits: ['change'],
    props: ['items', 'vars'],
    template: `
        <button v-on:click="click" v-bind:disabled="!items.length">
            {{ plural(items.length, 'Delete # file', 'Delete # files', 'Delete', 'Delete') }}
        </button>
    `,
    methods: {
        click: async function () {
            const {items} = this;
            const {conn, bucket} = this.vars;
            await blocking(async function (status) {
                for (let i = 0; i < items.length; ++i) {
                    status(`${i} of ${items.length}`);
                    await s3_objects_remove(conn, bucket, items[i].Key);
                }
                status('Done 🎉');
            });
            this.$emit('change');
        },
    },
});
