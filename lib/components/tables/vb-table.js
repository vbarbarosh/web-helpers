app.component('vb-table', {
    props: ['items', 'columns', 'selection'],
    template: `
        <table>
        <thead>
            <tr>
                <th v-if="selection">
                    <input v-on:click="click_th_checkbox" v-bind:checked="(selection.length === items.length)" type="checkbox">
                </th>
                <th v-for="col in computed_columns">
                    {{ col.label }}
                </th>
                <th v-if="$slots.actions" />
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in computed_items" ref="items" v-bind:class="{green: selection_set.has(item)}">
                <td v-if="selection" v-on:mousedown="mousedown_selrect_start">
                    <input v-on:change="v => change_selection(v, item)"
                           v-bind:checked="selection_set.has(item)"
                           type="checkbox">
                </td>
                <td v-for="col in computed_columns" v-on:mousedown="mousedown_selrect_start">
                    <slot v-if="col.slot" v-bind:name="col.slot" v-bind:item="item" />
                    <component v-else-if="col.component" v-bind:is="col.component" v-bind:value="col.read(item)" />
                    <template v-else>
                        {{ col.read(item) }}
                    </template>
                </td>
                <td v-if="$slots.actions">
                    <slot name="actions" v-bind:item="item" />
                </td>
            </tr>
        </tbody>
        </table>
        <div v-if="selrect_style" v-bind:style="selrect_style" class="fix yellow border o25"></div>
        <div v-if="feedback_style" v-bind:style="feedback_style" class="fix m5 yellow border o75 bs5 white">
            {{ feedback.message }}
        </div>
    `,
    data: function () {
        return {
            selrect: null,
            feedback: null,
            moving_target: null,
        };
    },
    computed: {
        selrect_style: function () {
            if (!this.selrect) {
                return null;
            }
            const {x, y, w, h} = this.selrect;
            return {
                top: px(y),
                left: px(x),
                width: px(w),
                height: px(h),
            };
        },
        feedback_style: function () {
            if (!this.feedback) {
                return null;
            }
            const {x, y} = this.feedback;
            return {
                top: px(y),
                left: px(x),
            };
        },
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
    watch: {
        items: function () {
        },
    },
    methods: {
        click_th_checkbox: function () {
            if (this.selection.length === 0) {
                this.selection.push(...this.items);
            }
            else {
                this.selection.splice(0, this.selection.length);
            }
        },
        mousedown_selrect_start: function (event) {
            if (event.target !== event.currentTarget || !this.selection) {
                return;
            }
            const _this = this;
            event.preventDefault();
            const s0 = _this.$refs.items[0].getBoundingClientRect();
            let skip = null;
            dd({
                event,
                update: function ({x, y, x0, y0}) {
                    const s1 = _this.$refs.items[0].getBoundingClientRect();
                    const sx = s1.left - s0.left;
                    const sy = s1.top - s0.top;
                    _this.selrect = {
                        x: Math.min(x, x0 + sx),
                        y: Math.min(y, y0 + sy),
                        w: Math.abs((x0 + sx) - x),
                        h: Math.abs((y0 + sy) - y)
                    };
                    const selrect = {
                        top: _this.selrect.y,
                        left: _this.selrect.x,
                        right: _this.selrect.x + _this.selrect.w,
                        bottom: _this.selrect.y + _this.selrect.h,
                    };
                    const next_selection = _this.items.filter(function (item, i) {
                        const r = _this.$refs.items[i].getBoundingClientRect();
                        return is_rects_intersects(selrect, r);
                    });
                    // if (skip === null) {
                    //     skip = !!next_selection.find(v => _this.selection.includes(v));
                    // }
                    // if (skip) {
                    //     _this.selrect = null;
                    //     const rects = _this.$refs.items.map(function (item) {
                    //         const {top, left, right, bottom} = item.getBoundingClientRect();
                    //         return {x: left, y: top, w: right - left, h: bottom - top};
                    //     });
                    //     _this.moving_target = _this.items[rects_closest(rects, x, y, 5)] || null;
                    //     _this.feedback = {
                    //         x, y, message: `${_this.selection.length} item(s)`
                    //     };
                    //     return;
                    // }
                    _this.selection.splice(0, _this.selection.length, ...next_selection);
                    _this.moving_target = null;
                },
                end: function () {
                    _this.selrect = null;
                    _this.moving_target = null;
                    _this.feedback = null;
                },
            });
        },
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
