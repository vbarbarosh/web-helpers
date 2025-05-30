app.component('modal-blocking', {
    props: ['value'],
    inject: ['modal'],
    template: `
        <div v-on:click="click_backdrop" class="fix-f flex-row oa" style="background:rgba(0,0,0,0.25)">
            <div class="ma">
                <template v-if="!value?.length">
                    <div class="m15 p15 white bs50 br5">
                        <spinner />
                    </div>
                </template>
                <template v-else>
                    <div class="min-w400 flex-col-center mg20 m15 p15 white bs50 br5">
                        <spinner />
                        <ul class="xls xp xm">
                            <li v-for="item in value" v-bind:key="item.uid">
                                {{ item.message }}
                            </li>
                        </ul>
                    </div>
                </template>
            </div>
        </div>
    `,
    data: function () {
        return {};
    },
    computed: {
    },
    watch: {
    },
    methods: {
        click_backdrop: function (event) {
            // Does not support cancellation
            // if (event.target === event.currentTarget) {
            //     this.modal.return(false);
            // }
        },
    },
    created: function () {
    },
    mounted: function () {
    },
    unmounted: function () {
    },
});

function modal_blocking(value)
{
    return vue_modal({template: '<modal-blocking v-bind:value="value" />', value});
}
