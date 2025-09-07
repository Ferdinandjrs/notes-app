class LoadingIndicator extends HTMLElement {
connectedCallback() {
this.render();
}
render() {
this.innerHTML = `<div class="loading" data-visible="false" style="display:none;"><div class="spinner"></div></div>`;
}
show() { this.querySelector('.loading').style.display = 'block'; }
hide() { this.querySelector('.loading').style.display = 'none'; }
}
customElements.define('loading-indicator', LoadingIndicator);