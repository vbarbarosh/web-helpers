app.component('vb-data-xx-empty', {
    props: ['value', 'empty'],
    watch: {
        value: function () {
            this.empty.splice(0, this.empty.length);
        },
    },
});
