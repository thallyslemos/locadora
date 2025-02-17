document.addEventListener('DOMContentLoaded', () => {
    // Inject layout elements
    const body = document.body;
    const content = document.querySelector('.content');
    
    // Create header and sidebar
    const layout = `
        <header>
            <h1>ConquistaCar Locadora</h1>
        </header>
        <div class="sidebar">
            <a href="categoria.html" ${window.location.pathname.includes('categoria') ? 'class="active"' : ''}>Categorias</a>
            <a href="automovel.html" ${window.location.pathname.includes('automovel') ? 'class="active"' : ''}>Automóveis</a>
        </div>
    `;
    
    // Insert layout before content
    const layoutDiv = document.createElement('div');
    layoutDiv.innerHTML = layout;
    body.insertBefore(layoutDiv, content);
});
