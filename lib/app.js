app.mixin({
    data: function () {
        return {
            win: Vue.markRaw(window),
        };
    },
    methods: {
        px,
        pc,
        format_bytes,
        format_date,
        format_thousands,
        plural,
        thumbnailer,
    },
});

app.config.errorHandler = async function (error) {
    console.log(error);
    await error_handler(error);
};

app.config.warnHandler = async function (error) {
    console.log('warnHandler', error);
};

// Prevent Vue from spamming the console with "helpful" tips
app.config.productionTip = false;
