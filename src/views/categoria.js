document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('categoriaForm');
    const categoriaList = document.getElementById('categoriaList');

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const formData = new FormData(form);
            const data = {
                nome: formData.get('nome'),
                descricao: formData.get('descricao'),
                preco_diaria: parseFloat(formData.get('preco_diaria')),
                exclusividade_funcionarios: formData.get('exclusividade_funcionarios') === 'on'
            };

            if (formData.get('id')) {
                data.id = parseInt(formData.get('id'));
            }

            const method = data.id ? 'PUT' : 'POST';
            const url = data.id ? `/api/categorias/${data.id}` : '/api/categorias';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const categoria = await response.json();
   
            displayCategoria(categoria);
            
            form.reset();
            form.id.value = '';
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao salvar categoria: ' + error.message);
        }
    }

    function displayCategoria(categoria) {
        const existingItem = document.getElementById(`categoria-${categoria.id}`);
        if (existingItem) {
            existingItem.remove();
        }

        const div = document.createElement('div');
        div.id = `categoria-${categoria.id}`;
        div.className = 'categoria-item';
        div.dataset.categoria = JSON.stringify(categoria);
        div.innerHTML = `
            <div class="categoria-info">
                <strong>${categoria.nome}</strong>
                <p>${categoria.descricao}</p>
                <p>R$ ${categoria.preco_diaria.toFixed(2)}</p>
                <p>Exclusivo: ${categoria.exclusividade_funcionarios ? 'Sim' : 'Não'}</p>
            </div>
            <div class="categoria-actions">
                <button type="button" onclick="editCategoria(${categoria.id})">Editar</button>
                <button type="button" onclick="deleteCategoria(${categoria.id})">Deletar</button>
            </div>
        `;
        categoriaList.appendChild(div);
    }

    window.editCategoria = (id) => {
        try {
            const categoriaDiv = document.getElementById(`categoria-${id}`);
            const categoria = JSON.parse(categoriaDiv.dataset.categoria);
            
            form.id.value = categoria.id;
            form.nome.value = categoria.nome;
            form.descricao.value = categoria.descricao;
            form.preco_diaria.value = categoria.preco_diaria;
            form.exclusividade_funcionarios.checked = categoria.exclusividade_funcionarios;
            
            form.scrollIntoView({ behavior: 'smooth' });
            form.nome.focus();
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao editar categoria');
        }
    };

    window.deleteCategoria = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;
        
        try {
            const response = await fetch(`/api/categorias/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Erro ao excluir categoria');
            document.getElementById(`categoria-${id}`).remove();
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao excluir categoria: ' + error.message);
        }
    };

    async function loadCategorias() {
        try {
            categoriaList.innerHTML = '<p>Carregando categorias...</p>';
            const response = await fetch('/api/categorias');
            if (!response.ok) throw new Error('Erro ao carregar categorias');
            const categorias = await response.json();
            categoriaList.innerHTML = '';
            categorias.forEach(displayCategoria);
        } catch (error) {
            console.error('Error:', error);
            categoriaList.innerHTML = '<p>Erro ao carregar categorias</p>';
        }
    }

    form.addEventListener('reset', () => {
        form.id.value = '';
    });

    form.addEventListener('submit', handleSubmit);
    loadCategorias();
});
