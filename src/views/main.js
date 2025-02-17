document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar a');
    const mainContent = document.getElementById('mainContent');

    async function loadModule(view) {
        try {
            const response = await fetch(view);
            if (!response.ok) throw new Error('Failed to load module');
            
            const content = await response.text();
            mainContent.innerHTML = content;

            const scripts = mainContent.getElementsByTagName('script');
            for (let script of scripts) {
                const newScript = document.createElement('script');

                for (let attr of script.attributes) {
                    newScript.setAttribute(attr.name, attr.value);
                }

                if (script.innerHTML) {
                    newScript.innerHTML = script.innerHTML;
                }

                script.parentNode.replaceChild(newScript, script);
            }

            links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-view') === view) {
                    link.classList.add('active');
                }
            });
        } catch (error) {
            console.error('Error loading module:', error);
            mainContent.innerHTML = `
                <div class="error-message">
                    <h3>Erro ao carregar módulo</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }

    links.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const view = link.getAttribute('data-view');
            await loadModule(view);
        });
    });

    const initialView = links[0].getAttribute('data-view');
    loadModule(initialView);
});
