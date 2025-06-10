app.component('modal-mongo-collections-remove', {
    props: ['value'],
    inject: ['modal'],
    template: `
        <div v-on:click="click_backdrop" class="fix-f flex-row oa" style="background:rgba(0,0,0,0.25)">
            <div class="ma">
                <div class="w500 m15 p15 white bs50 br5">
                    <h2>Remove Mongo Collection</h2>
                    <prism-js v-bind:value="vars_json" />
                    <div class="flex-row-center mi10">
                        <button-red v-on:click="click_remove">Remove</button-red>
                        <button-transparent v-on:click="modal.return(false)">Cancel</button-transparent>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function () {
    },
    computed: {
        vars_json: function () {
            return JSON.stringify(this.value, null, 4);
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
        click_remove: m_modal_hide(async function () {
            const response = await blocking(mongo_collections_remove(this.value.conn, this.value.db, this.value.col));
            console.log(response);
            this.modal.return(true);
        }),
    },
    unmounted: function () {
    },
});

function modal_mongo_collections_remove(value)
{
    return vue_modal({template: '<modal-mongo-collections-remove v-bind:value="value" />', value});
}
