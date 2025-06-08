# Prompts Editor

```vue
<vb-data-vars v-slot="vars" :vars="{
        current: null,
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
    }" v-on:init="v => v.current = v.samples[0]">
    <button-json :value="vars"></button-json>
    <div class="hsplit">
        <div class="mg25">
            <form-textarea v-model="vars.current.prompt"></form-textarea>
            <button-green v-on:click="vars.samples.unshift(vars.current = {prompt: ''})">New</button-green>
        </div>
        <div class="max-w400">
            <ul>
                <li v-for="item in vars.samples" @click="vars.current = item" :class="{yellow: (vars.current === item)}" class="cur-pointer">
                    {{ item.prompt }}
                </li>
            </ul>
        </div>
    </div>
</vb-data-vars>
```
