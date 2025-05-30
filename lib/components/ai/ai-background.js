app.component('ai-background', {
    emits: [],
    props: ['value'],
    template: `
        <div class="hsplit">
            <div class="fluid mg10">
                <form-textarea v-model="prompt" label="Describe an image" />
                <button v-on:click="click_generate_background" class="rel button-green">
                    <svg-icon-ai class="abs-cl ml20 w18 h28" />
                    Generate Background
                </button>
                <img v-if="image_url" v-bind:src="thumbnailer(image_url, {w: 200})" class="db max-ww mv25 bs25" alt="">
            </div>
            <div class="w400">
                <ul class="xm xp">
                    <li v-for="sample in samples" v-on:click="click_sample(sample)" class="cur-pointer">
                        {{ sample.prompt }}
                    </li>
                </ul>
            </div>
        </div>
    `,
    data: function () {
        return {
            prompt: 'A magical Christmas image in a winter world, the snow sparkles and the iced podium in the middle of the\nforest shines with Christmas lights that leave shadows on the ground.',
            samples: [
                // https://www.photoroom.com/blog/create-ai-prompts
                {prompt: 'A minimalist, elegant background with a soft, neutral color palette and subtle shadows, conveying a sense of sophistication and high quality.'},
                {prompt: 'An outdoor setting with a vibrant, natural landscape, featuring lush greenery and a clear blue sky, ideal for products related to outdoor activities or eco-friendliness.'},
                {prompt: 'A modern, urban environment with sleek architectural elements and a monochrome color scheme, perfect for tech or lifestyle products.'},
                {prompt: 'A rustic, vintage background with warm, earthy tones and textures like aged wood and weathered stone, suitable for artisanal or heritage products.'},
                {prompt: 'A bright, playful setting filled with pastel colors and whimsical elements like balloons or confetti, great for products targeted at children or for fun, lifestyle goods.'},
                {prompt: 'An artistic, abstract background with bold colors and dynamic patterns, creating a vibrant and eye-catching setting for creative or design-oriented products.'},
                {prompt: 'A serene, spa-like setting with elements of tranquility like smooth stones, bamboo, and a calming water feature, ideal for wellness or beauty products.'},
                {prompt: 'A luxurious, opulent background with rich textures and colors, gold or silver accents, and a sense of exclusivity, fitting for high-end luxury products.'},
                {prompt: 'A cozy, homely setting with a comfortable, inviting ambiance, featuring elements like soft lighting, plush textiles, and warm tones, suitable for home goods or comfort products.'},
                {prompt: 'A futuristic, sci-fi-inspired background with sleek, metallic surfaces and neon lights, offering a cutting-edge feel for innovative or tech-forward products.'},
            ],
            image_url: null,
        };
    },
    computed: {
    },
    watch: {
    },
    methods: {
        click_sample: function (sample) {
            this.prompt = sample.prompt;
        },
        click_generate_background: async function () {
            this.image_url = await blocking(http_post_json('/api/v1/black-forest-labs/image', {prompt: this.prompt}));
        },
    },
    created: async function () {
    },
    unmounted: function () {
    },
});
