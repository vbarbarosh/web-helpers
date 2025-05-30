// https://prismjs.com/
app.component('prism-html', {
    emits: [],
    props: ['value'],
    template: `
        <pre><code v-html="html" /></pre>
    `,
    data: function () {
        return {
            ready: false,
        };
    },
    computed: {
        html: function () {
            if (!this.ready) {
                return '';
            }
            return Prism.highlight(this.value, Prism.languages.html, 'html');
        },
    },
    watch: {
    },
    methods: {
    },
    created: async function () {
        await new Promise(function (resolve, reject) {
            Prism.plugins.autoloader.loadLanguages(['html'], resolve, reject);
        });
        this.ready = true;
    },
    unmounted: function () {
    },
});
