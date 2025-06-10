app.component('modal-mongo-collections-create', {
    props: ['value'],
    inject: ['modal'],
    template: `
        <div v-on:click="click_backdrop" class="fix-f flex-row oa" style="background:rgba(0,0,0,0.25)">
            <div class="ma">
                <div class="w500 m15 p15 white bs50 br5">
                    <h2>Create Mongo Collection</h2>
                    <div>
                        <form-string v-model="name" label="Name" />
                    </div>
                    <div class="flex-row-center mi10">
                        <button-green v-on:click="click_create">Create</button-green>
                        <button-transparent v-on:click="modal.return(false)">Cancel</button-transparent>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            name: 'aaa',
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
            const out = await blocking(mongo_collections_create(this.value.conn, this.value.db, {name: this.name}));
            this.modal.return(out);
        }),
    },
    unmounted: function () {
    },
});

function modal_mongo_collections_create(value)
{
    return vue_modal({template: '<modal-mongo-collections-create v-bind:value="value" />', value});
}
