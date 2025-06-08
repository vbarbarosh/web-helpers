app.component('button-json', {
    emits: [],
    props: ['value'],
    template: `
        <button v-on:click="click" class="w25 h25 vm cur-pointer xbutton">
            <svg-icon-json class="db ww hh" />
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
