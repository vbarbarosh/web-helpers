app.component('modal-mongo-documents-upload', {
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
        const {conn, db, col, files} = this.value;
        await blocking(async function (status) {
            for (let i = 0; i < files.length; i++) {
                status(`${i + 1} of ${files.length}`);
                const body = await file_read_json(files[i]);
                await mongo_documents_create(conn, db, col, {body});
            }
            status('Done');
        });
        this.modal.return(true);
    }),
    unmounted: function () {
    },
});

function modal_mongo_documents_upload(value)
{
    return vue_modal({template: '<modal-mongo-documents-upload v-bind:value="value" />', value});
}

function file_read_text(file)
{
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function (event) {
            resolve(event.target.result);
        };
        reader.onerror = function (error) {
            reject(error);
        };
        reader.readAsText(file);
    });
}

async function file_read_json(file)
{
    const s = await file_read_text(file);
    return JSON.parse(s);
}
