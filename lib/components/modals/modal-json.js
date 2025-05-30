app.component('modal-json', {
    props: ['value'],
    inject: ['modal'],
    template: `
        <div v-on:click="click_backdrop" class="fix-f flex-row p50 oa" style="background:rgba(0,0,0,0.25)">
            <div class="rel ma max-ww max-hh bbox p15 white bs50 br5 oa">
                <div class="min-w600">
                    <div class="sticky-t">
                        <copy-to-clipboard v-bind:value="json" class="m10n" />
                    </div>
                    <vb-prism-js v-bind:value="json" />
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {};
    },
    computed: {
        json: function () {
            return JSON.stringify(this.value, null, 2);
        },
    },
    watch: {
    },
    methods: {
        click_backdrop: function (event) {
            if (event.target === event.currentTarget) {
                this.modal.return(false);
            }
        },
    },
    unmounted: function () {
    },
});

function modal_json(value)
{
    return vue_modal({template: '<modal-json v-bind:value="value" />', value});
}
