app.component('vb-table', {
    props: ['items', 'columns', 'selection'],
    template: `
        <table>
        <thead>
            <tr>
                <th v-if="selection">
                    <input type="checkbox">
                </th>
                <th v-for="col in computed_columns">
                    {{ col.label }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in computed_items">
                <td v-if="selection">
                    <input v-on:change="v => change_selection(v, item)"
                           v-bind:checked="selection_set.has(item)"
                           type="checkbox">
                </td>
                <td v-for="col in computed_columns">
                    <slot v-if="col.slot" v-bind:name="col.slot" v-bind:item="item" />
                    <component v-else-if="col.component" v-bind:is="col.component" v-bind:value="col.read(item)" />
                    <template v-else>
                        {{ col.read(item) }}
                    </template>
                </td>
            </tr>
        </tbody>
        </table>
    `,
    computed: {
        computed_items: function () {
            return this.items ?? [];
        },
        computed_columns: function () {
            if (!this.columns) {
                if (!this.computed_items[0]) {
                    return [];
                }
                const out = Object.keys(this.computed_items[0]).map(function (key) {
                    return {label: key, read: item => item[key]};
                });
                out.push({label: '', read: v => v, component: 'button-json'});
                return out;
            }
            return (this.columns ?? []).map(function (col) {
                const out = {...col};
                if (typeof out.read !== 'function') {
                    out.read = function (item) {
                        if (col.read) {
                            return item[col.read];
                        }
                        return item[col.label] ?? item;
                    };
                }
                return out;
            });
        },
        selection_set: function () {
            return new Set(this.selection);
        },
    },
    methods: {
        change_selection: function (event, item) {
            const i = this.selection.indexOf(item);
            if (event.target.checked) {
                if (i === -1) {
                    this.selection.push(item);
                }
            }
            else {
                if (i !== -1) {
                    this.selection.splice(i, 1);
                }
            }
        },
    },
});
