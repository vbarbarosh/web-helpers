app.component('breadcrumbs-item', {
    props: ['value', 'label', 'active'],
    inject: ['tabs'],
    template: `<div v-if="local_item" v-show="local_item.active" class="tab-content"><slot /></div>`,
    data: function () {
        return {
            local_item: null,
        };
    },
    watch: {
        value: {
            immediate: true,
            handler: async function (next, prev) {
                if (next === prev) {
                    return;
                }
                this.tabs.tabs_remove(this);
                this.local_item = null;
                if (next) {
                    await this.$nextTick();
                    this.local_item = this.tabs.tabs_add(this);
                }
            },
        },
    },
    unmounted: function () {
        this.tabs.tabs_remove(this);
    },
});
