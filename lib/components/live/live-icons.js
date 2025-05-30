app.component('live-icons', {
    emits: [],
    props: ['value', 'data'],
    template: `
        <live-icons-inner v-bind:value="value" v-bind:data="data" />
    `,
    data: function () {
        return {};
    },
    computed: {
    },
    watch: {
    },
    methods: {
    },
    created: async function () {
    },
    unmounted: function () {
    },
    errorCaptured: function (error, vm, info) {
        console.log('errorCapture.live-icons', error);
        return false;
    }
});
