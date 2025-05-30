app.component('highlight', {
    props: ['text', 'substring'],
    template: `
        <span v-for="(s, i) in computed_items" v-bind:class="{yellow: (i % 2 === 1)}">{{ s }}</span>
    `,
    data: function () {
        return {};
    },
    computed: {
        computed_items: function () {
            return this.highlight_split(this.text, this.substring);
        },
    },
    watch: {
    },
    methods: {
        highlight_split: function (s, substring) {
            if (!substring) {
                return [s];
            }
            const re = new RegExp(`(${escape_regexp(substring)})`, 'ig');
            return s.split(re);
        }
    },
    unmounted: function () {
    },
});
