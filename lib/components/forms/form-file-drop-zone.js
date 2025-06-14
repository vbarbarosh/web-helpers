app.component('form-file-drop-zone', {
    emits: ['update:modelValue'],
    props: ['modelValue', 'label'],
    template: `
        <label v-on:dragover="dragover"
               v-on:dragleave="dragleave"
               v-on:drop="drop"
               v-bind:class="{active: is_active}"
               class="form-file-drop-zone">
            <span v-if="label" class="form-label">{{ label }}</span>
            <input ref="input" v-on:change="change_input" type="file" style="display:none;" />
            <div>
                <span v-if="!modelValue">Drop file here or click to select</span>
                <span v-else>{{ modelValue.name }}</span>
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
        drop: function (event) {
            event.preventDefault();
            this.is_active = false;
            const file = event.dataTransfer.files && event.dataTransfer.files[0];
            console.log('drop', file);
            if (file) {
                this.$emit('update:modelValue', file);
            }
        },
        change_input: function (event) {
            const file = event.target.files && event.target.files[0];
            console.log('change', file);
            if (file) {
                this.$emit('update:modelValue', file);
            }
            event.target.value = '';
        },
    },
});

css`
    .form-file-drop-zone {
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
    .form-file-drop-zone.active {
        border-color: #1976d2;
        background: #e3f2fd;
    }
    .form-file-drop-zone > div {
        padding: 2em;
        text-align: center;
        color: #666;
        user-select: none;
    }
`;
