app.component('live-vue-inner', {
    emits: [],
    props: ['value', 'data'],
    template: `
        <div class="rel flex-row gap10">
            <copy-to-clipboard v-bind:value="html" />
<!--
            <Transition>
                <svg-icon-check v-if="check" v-on:click="click_copy_to_clipboard" class="abs-tr w15 h15 p8 cur-pointer" />
                <svg-icon-copy v-else v-on:click="click_copy_to_clipboard" class="abs-tr w15 h15 p8 cur-pointer" />
            </Transition>
-->
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
            check: false,
            check_timer_uid: null,
            html: this.value,
            spec: null,
        };
    },
    computed: {
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
        click_copy_to_clipboard: async function (event) {
            window.navigator.clipboard.writeText(this.html);
            this.check = true;
            const uid = crypto.randomUUID();
            this.check_timer_uid = uid;
            await Promise.delay(1000);
            if (this.check_timer_uid === uid) {
                this.check = false;
            }
        },
    },
    created: async function () {
    },
    unmounted: function () {
    },
});
