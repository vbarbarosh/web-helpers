app.component('vb-breadcrumbs', {
    props: ['items', 'vars'],
    template: `
        <div class="tabs">
            <div class="tab-header">
                <div v-for="item in local_items"
                        v-on:click="click_tab(item)"
                        v-bind:key="item.uid"
                        v-bind:class="{active: item.active}" class="tab-button">
                    {{ item.label }}
                </div>
            </div>
            <slot v-bind="{foo: 1, bar: 2}" />
        </div>
    `,
    provide: function () {
        return {
            tabs: this,
        };
    },
    data: function () {
        return {
            local_items: [],
        };
    },
    computed: {
        active: function () {
            return this.local_items.find(v => v.active);
        },
    },
    methods: {
        tabs_add: function (inst) {
            const out = {
                uid: crypto.randomUUID(),
                label: inst.label,
                active: true,
                inst,
            };
            this.local_items.forEach(v => v.active = false);
            this.local_items.push(out);
            return out;
        },
        tabs_remove: function (inst) {
            const i = this.local_items.findIndex(v => v.inst === inst);
            if (i !== -1) {
                this.local_items.splice(i, 1);
                const last = this.local_items[this.local_items.length - 1];
                this.local_items.forEach(v => v.active = (v === last));
            }
        },
        click_tab: function (tab) {
            this.local_items.forEach(v => v.active = (v === tab));
        },
    },
});
