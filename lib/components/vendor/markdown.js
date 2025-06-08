// https://github.com/Markdown-it/Markdown-it
app.component('markdown', {
    emits: [],
    props: ['value'],
    template: `
        <component ref="component" v-bind:is="spec" v-bind:key="html" />
    `,
    data: function () {
        const md = Vue.markRaw(markdownit());

        md.use(function (md) {
            const defaultFence = md.renderer.rules.fence || function (tokens, idx, options, env, self) {
                return self.renderToken(tokens, idx, options);
            };

            md.renderer.rules.fence = function (tokens, idx, options, env, self) {
                const token = tokens[idx];

                if (token.info.trim() === 'vue') {
                    const content = token.content;
                    // Return your custom HTML
                    // return `<div class="vue-block">${md.utils.escapeHtml(content)}</div>\n`;
                    const json = md.utils.escapeHtml(JSON.stringify(content));
                    return `
                        <div class="vue-block">
                            <div class="rel"><copy-to-clipboard v-bind:value="${json}"></copy-to-clipboard></div>
                            ${content}
                        </div>
                    `;
                }

                // Default rendering
                return defaultFence(tokens, idx, options, env, self);
            };
        });

        return {
            md,
            spec: null,
        };
    },
    computed: {
        html: function () {
            return this.md.render(this.value);
        },
    },
    watch: {
        html: {
            immediate: true,
            handler: function () {
                this.spec = Vue.markRaw({template: this.html, data: () => this.data ?? {}});
                if (this.$refs.component) {
                    this.$refs.component.$forceUpdate();
                }
            },
        },
    },
    methods: {
    },
    mounted: function () {
    },
    unmounted: function () {
    },
});

html`
    <script src="https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js"></script>
`;

css`
    .vue-block {
        border: 1px dashed;
    }
`;