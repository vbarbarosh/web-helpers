app.component('tabs-item', {
    props: ['label', 'active'],
    inject: ['tabs'],
    template: `<div v-show="local_item.active" class="tab-content"><slot /></div>`,
    data: function () {
        return {
            uuid: crypto.randomUUID(),
            local_item: null,
        };
    },
    created: function () {
        this.local_item = this.tabs.tabs_add(this);
    },
    unmounted: function () {
        this.tabs.tabs_remove(this);
    },
});
