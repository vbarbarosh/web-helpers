const VBCounter = Vue.defineCustomElement({
    props: ['value'],
    template: `
        <button v-on:click="click">{{ counter }}</button>
    `,
    data: function () {
        return {
            counter: 1,
        };
    },
    methods: {
        click: function () {
            this.counter++;
        },
    },
    styles: [`
    `],
});

customElements.define('vb-counter', VBCounter);
