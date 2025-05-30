class VBCard extends HTMLElement
{
    constructor() {
        super();
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .card {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    background: #fff;
                }
            </style>
            <div class="card">
                <h2>Hi there! 👋</h2>
                <p>This is a reusable card component. 🧩</p>
            </div>
        `;
    }
}

customElements.define('vb-card', VBCard);
