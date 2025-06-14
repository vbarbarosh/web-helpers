app.component('modal-error', {
    props: ['value'],
    inject: ['modal'],
    template: `
        <div v-on:click="click_backdrop" class="fix-f flex-row oa" style="background:rgba(0,0,0,0.25)">
            <div class="ma">
                <div class="w500 m15 white bs50 br5">
                    <h2 class="modal-header">
                        Error
                        <button v-on:click="modal.return(false)" class="xbutton mla cur-pointer">
<!--                            <svg-icon-cross class="db w15 h15" />-->
<!--                            <icon-iconduck-308805-window-close class="db w32 h32" />-->
                            <icon-iconduck-308863-emblem-unreadable class="w32 h32" />
                        </button>
                    </h2>
                    <div class="p15 mg15">
                        <div class="flex-row flex-align-center flex-justify-start gap15">
                            <icon-iconduck-308949-dialog-error class="w32 h32" />
                            <div>{{ value.error.message }}</div>
                        </div>
                        <prism-js v-if="http_response_data_json" :value="http_response_data_json" />
                        <div class="flex-row-center mi10">
                            <button-transparent v-on:click="modal.return(false)">Dismiss</button-transparent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {};
    },
    computed: {
        http_response_data_json: function () {
            try {
                if (typeof this.value.error.response?.data === 'object') {
                    return JSON.stringify(this.value.error.response.data, null, 4);
                }
                if (this.value.error.response?.data) {
                    try {
                        const json = JSON.parse(this.value.error.response.data);
                        return JSON.stringify(json, null, 4);
                    }
                    catch (error) {
                    }
                }
            }
            catch (error) {
            }
            return false;
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
    created: function () {
        console.log(this.value);
    },
    unmounted: function () {
    },
});

function modal_error(value)
{
    return vue_modal({template: '<modal-error v-bind:value="value" />', value});
}
