app.component('button-selection', {
    emits: [],
    props: ['value'],
    template: `
        <button v-on:click="click">
            Selection [{{ value.length }}]
        </button>
    `,
    data: function () {
        return {};
    },
    computed: {
    },
    watch: {
    },
    methods: {
        click: async function () {
            await modal_json(this.value).promise();
        },
    },
    created: function () {
    },
    unmounted: function () {
    },
});
