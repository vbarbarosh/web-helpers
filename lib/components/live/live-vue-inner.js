app.component('live-vue-inner', {
    emits: [],
    props: ['value', 'data'],
    template: `
        <div class="rel flex-row gap10">
            <copy-to-clipboard v-bind:value="html" />
            <div class="fluid">
                <component ref="component" v-bind:is="spec" v-bind:key="html" />
            </div>
            <div class="w500">
                <prism-html v-bind:value="html.trim()" class="dashed ph10 pv5 sticky t15" />
            </div>
        </div>
    `,
    data: function () {
        return {
            spec: null,
        };
    },
    computed: {
        html: function () {
            return this.value;
        },
    },
    watch: {
        html: {
            immediate: true,
            handler: function () {
                this.spec = Vue.markRaw({template: this.html, data: () => this.data ?? {}});
                if (this.$refs.component) {
                    this.$refs.component.$forceUpdate();
                }
            },
        },
    },
    methods: {
    },
    created: function () {
    },
    unmounted: function () {
    },
});
