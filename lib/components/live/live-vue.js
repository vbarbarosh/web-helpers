app.component('live-vue', {
    emits: [],
    props: ['value', 'data'],
    template: `
        <live-vue-inner v-bind:value="value" v-bind:data="data" />
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
        console.log('errorCapture.live-vue', error);
        return false;
    }
});
