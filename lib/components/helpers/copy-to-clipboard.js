app.component('copy-to-clipboard', {
    emits: [],
    props: ['value'],
    template: `
        <Transition>
            <svg-icon-check v-if="check" v-on:click="click_copy_to_clipboard" class="abs-tr w15 h15 p8 cur-pointer z1" />
            <svg-icon-copy v-else v-on:click="click_copy_to_clipboard" class="abs-tr w15 h15 p8 cur-pointer z1" />
        </Transition>
    `,
    data: function () {
        return {
            check: null,
        };
    },
    computed: {
    },
    watch: {
    },
    methods: {
        click_copy_to_clipboard: async function () {
            window.navigator.clipboard.writeText(this.value);
            const uid = crypto.randomUUID();
            this.check = uid;
            await Promise.delay(1000);
            if (this.check === uid) {
                this.check = null;
            }
        },
    },
    created: function () {
    },
    unmounted: function () {
    },
});
