app.component('modal-mongo-analyze', {
    props: ['value'],
    inject: ['modal'],
    template: `
        <div v-on:click="click_backdrop" class="fix-f flex-row oa" style="background:rgba(0,0,0,0.25)">
            <div class="ma">
                <div class="w500 m15 p15 white bs50 br5">
                    <h2>Uploading documents</h2>
                    <div class="flex-row-center gap10">
                        <button-transparent v-on:click="modal.return(false)">Cancel</button-transparent>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
        };
    },
    computed: {
    },
    watch: {
    },
    methods: {
        click_backdrop: function (event) {
            if (event.target === event.currentTarget) {
                this.modal.return(false);
            }
        },
        click_create: m_modal_hide(async function () {
            const out = await blocking();
            this.modal.return(out);
        }),
    },
    created: m_modal_hide(async function () {
        try {
            const {conn, db, col} = this.value;
            const out = await blocking(mongo_analyze(conn, db, col));
            console.log(out);
        }
        finally {
            this.modal.return(false);
        }
    }),
    unmounted: function () {
    },
});

function modal_mongo_analyze(value)
{
    return vue_modal({template: '<modal-mongo-analyze v-bind:value="value" />', value});
}
