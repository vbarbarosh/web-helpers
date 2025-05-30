app.component('copy-to-clipboard2', {
    emits: [],
    props: ['value'],
    template: `
        <Transition v-on:click="click">
            <div class="w32 h32 p5 z1">
                <svg-icon-check v-if="check" class="w32 h32 p5 border cur-pointer color-green" />
                <slot v-else><span>copy-to-clipboard2</span></slot>
            </div>
        </Transition>
    `,
    data: function () {
        return {
            check: false,
            check_timer_uid: null,
        };
    },
    computed: {
    },
    watch: {
    },
    methods: {
        click: async function () {
            window.navigator.clipboard.writeText(this.value);
            this.check = true;
            const uid = crypto.randomUUID();
            this.check_timer_uid = uid;
            await Promise.delay(1000);
            if (this.check_timer_uid === uid) {
                this.check = false;
            }
        },
    },
    created: function () {
    },
    mounted: function () {
        //this.$el.nextElementSibling.addEventListener('click', this.click);
    },
    beforeDestroy: function () {
        //this.$el.nextElementSibling.removeEventListener('click', this.click);
    },
});
