app.component('s3-objects-replace', {
    emits: ['change'],
    props: ['items', 'vars'],
    template: `
        <button v-bind:disabled="!items?.length" v-on:click="click">
            {{ plural(items?.length, 'Upload # file', 'Upload # files', 'Upload', 'Upload') }}
        </button>
    `,
    methods: {
        click: async function () {
            const files = this.items;
            const {conn, bucket} = this.vars;
            const Prefix = this.vars.Prefix || '';
            await blocking(async function (status) {
                for (let i = 0; i < files.length; ++i) {
                    const file = files[i];
                    status(`${i} of ${files.length}`);
                    const path = `${Prefix}/${file.fullPath ?? file.name}`.replaceAll(/\/\/+/g, '/');
                    await s3_objects_replace(conn, bucket, path, file);
                }
                status('Done');
            });
            this.$emit('change');
        },
    },
});
