app.component('form-files-drop-zone', {
    emits: ['update:modelValue'],
    props: ['modelValue', 'label', 'limit', 'filter'],
    template: `
        <label v-on:dragover="dragover"
               v-on:dragleave="dragleave"
               v-on:drop="drop"
               v-bind:class="{active: is_active}"
               class="form-file-drop-zone">
            <span v-if="label" class="form-label">{{ label }}</span>
            <input ref="input" v-on:change="change" type="file" webkitdirectory multiple style="display:none;" />
            <div>
                <span v-if="!modelValue">Drop files here or click to select</span>
                <span v-else>{{ plural(modelValue.length, '# item selected', '# items selected', 'No items selected') }}</span>
<!--                <vb-table v-else :items="modelValue" :columns="[{label: 'name'}, {label: 'size'}, {label: 'fullPath'}]" />-->
            </div>
        </label>
    `,
    data: function () {
        return {
            is_active: false,
        };
    },
    methods: {
        dragover: function (event) {
            event.preventDefault();
            this.is_active = true;
        },
        dragleave: function (event) {
            event.preventDefault();
            this.is_active = false;
        },
        drop: async function (event) {
            event.preventDefault();
            this.is_active = false;
            this.$emit('update:modelValue', await blocking(get_event_files(event, {limit: this.limit, filter: this.filter})));
        },
        change: async function (event) {
            this.$emit('update:modelValue', await blocking(get_event_files(event, {limit: this.limit, filter: this.filter})));
            event.target.value = '';
        },
    },
});

css`
    .form-files-drop-zone {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        border: 2px dashed #aaa;
        border-radius: 0.5em;
        padding: 1em;
        cursor: pointer;
        background: #fafafa;
        transition: border-color 0.2s;
    }
    .form-files-drop-zone.active {
        border-color: #1976d2;
        background: #e3f2fd;
    }
    .form-files-drop-zone > div {
        padding: 2em;
        text-align: center;
        color: #666;
        user-select: none;
    }
`;

async function get_event_files(event, options = {})
{
    const limit = options.limit ?? Number.MAX_SAFE_INTEGER;
    const filter = options.filter ?? (() => true);
    if (!event.dataTransfer) {
        const files = Array.from(event.target.files);
        const out = [];
        for (const file of files) {
            if (out.length >= limit) {
                break;
            }
            file.fullPath ??= '/' + (file.webkitRelativePath ?? file.name);
            if (filter(file)) {
                out.push(file);
            }
        }
        return out;
    }
    const out = [];
    const buf = Array.from(event.dataTransfer.items).map(v => v.webkitGetAsEntry());
    while (buf.length) {
        const entry = buf.pop();
        if (entry.isFile) {
            const file = await new Promise((resolve, reject) => entry.file(resolve, reject));
            file.fullPath = entry.fullPath;
            if (filter(file)) {
                out.push(file);
            }
            if (out.length >= limit) {
                break;
            }
        }
        else if (entry.isDirectory) {
            buf.push(...await new Promise((resolve, reject) => entry.createReader().readEntries(resolve, reject)));
        }
    }
    return out;
}
