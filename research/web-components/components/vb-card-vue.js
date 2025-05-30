const VBCardVue = Vue.defineCustomElement({
    template: `
        <link href="https://unpkg.com/@vbarbarosh/smcss@1.2.0/dist/sm.css" rel="stylesheet">
        <div class="card">
            <h2>Hello, Vue is here! 👋</h2>
            <p>This is a reusable card component. 🧩</p>
            <p class="red">red</p>
            <button v-on:click="click">{{ counter }}</button>
        </div>
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
        :host {
            display: block;
        }
        .card {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            background: #fff;
        }
    `],
});

customElements.define('vb-card-vue', VBCardVue);
