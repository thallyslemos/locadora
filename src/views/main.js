document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar a');
    const mainContent = document.getElementById('mainContent');

    links.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const view = link.getAttribute('data-view');
            const response = await fetch(view);
            const content = await response.text();
            mainContent.innerHTML = content;
            const scriptTags = mainContent.querySelectorAll('script');
            scriptTags.forEach(scriptTag => {
                const newScriptTag = document.createElement('script');
                newScriptTag.src = scriptTag.src;
                newScriptTag.onload = () => scriptTag.remove();
                document.body.appendChild(newScriptTag);
            });
        });
    });

    links[0].click();
});
