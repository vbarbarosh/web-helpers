app.component('live-icons-inner', {
    emits: [],
    props: ['value', 'data'],
    template: `
        <div class="rel flex-row gap10">
            <template v-for="item in items">
                <copy-to-clipboard2 v-bind:value="item.html">
                    <component v-bind:is="item.spec" class="p5 border cur-pointer" />
                </copy-to-clipboard2>
            </template>
        </div>
    `,
    data: function () {
        return {
            check: false,
            check_timer_uid: null,
            spec: null,
        };
    },
    computed: {
        items: function () {
            return this.value.split('\n').filter(v => v).map(function (icon) {
                const html = `<${icon} class="w32 h32" />`;
                return {
                    spec: Vue.markRaw({template: html}),
                    html,
                };
            });
        },
    },
    watch: {
    },
    methods: {
    },
    created: async function () {
    },
    unmounted: function () {
    },
});
