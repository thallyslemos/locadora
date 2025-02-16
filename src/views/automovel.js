document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('automovelForm');
    const automovelList = document.getElementById('automovelList');
    const categoriaSelect = document.getElementById('categoria_id');
    console.log('automovel.js loaded');

    async function loadCategorias() {
        try {
            const response = await fetch('/api/categorias');
            const categorias = await response.json();
            categoriaSelect.innerHTML = '<option value="">Selecione uma categoria</option>';
            categorias.forEach(categoria => {
                categoriaSelect.innerHTML += `
                    <option value="${categoria.id}">${categoria.nome}</option>
                `;
            });
        } catch (error) {
            console.error('Error loading categorias:', error);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const formData = new FormData(form);
            const data = {
                chassi: formData.get('chassi'),
                placa: formData.get('placa'),
                marca: formData.get('marca'),
                modelo: formData.get('modelo'),
                ano: parseInt(formData.get('ano')),
                cor: formData.get('cor'),
                categoria_id: parseInt(formData.get('categoria_id'))
            };

            if (formData.get('id')) {
                data.id = parseInt(formData.get('id'));
            }

            const method = data.id ? 'PUT' : 'POST';
            const url = data.id ? `/api/veiculos/${data.id}` : '/api/veiculos';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const automovel = await response.json();
            displayAutomovel(automovel);
            form.reset();
            form.id.value = '';
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao salvar automóvel: ' + error.message);
        }
    }

    function displayAutomovel(automovel) {
        const existingItem = document.getElementById(`automovel-${automovel.id}`);
        if (existingItem) {
            existingItem.remove();
        }

        const div = document.createElement('div');
        div.id = `automovel-${automovel.id}`;
        div.className = 'categoria-item';
        div.dataset.automovel = JSON.stringify(automovel);
        div.innerHTML = `
            <div class="categoria-info">
                <strong>${automovel.marca} ${automovel.modelo}</strong>
                <p>Placa: ${automovel.placa} | Chassi: ${automovel.chassi}</p>
                <p>Ano: ${automovel.ano} | Cor: ${automovel.cor}</p>
                <p>Categoria ID: ${automovel.categoria_id}</p>
            </div>
            <div class="categoria-actions">
                <button type="button" onclick="editAutomovel(${automovel.id})">Editar</button>
                <button type="button" onclick="deleteAutomovel(${automovel.id})">Deletar</button>
            </div>
        `;
        automovelList.appendChild(div);
    }

    window.editAutomovel = (id) => {
        try {
            const automovelDiv = document.getElementById(`automovel-${id}`);
            const automovel = JSON.parse(automovelDiv.dataset.automovel);
            
            form.id.value = automovel.id;
            form.chassi.value = automovel.chassi;
            form.placa.value = automovel.placa;
            form.marca.value = automovel.marca;
            form.modelo.value = automovel.modelo;
            form.ano.value = automovel.ano;
            form.cor.value = automovel.cor;
            form.categoria_id.value = automovel.categoria_id;
            
            form.scrollIntoView({ behavior: 'smooth' });
            form.chassi.focus();
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao editar automóvel');
        }
    };

    window.deleteAutomovel = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este automóvel?')) return;
        
        try {
            const response = await fetch(`/api/veiculos/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Erro ao excluir automóvel');
            document.getElementById(`automovel-${id}`).remove();
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao excluir automóvel: ' + error.message);
        }
    };

    async function loadAutomoveis() {
        try {
            automovelList.innerHTML = '<p>Carregando automóveis...</p>';
            const response = await fetch('/api/veiculos');
            if (!response.ok) throw new Error('Erro ao carregar automóveis');
            const automoveis = await response.json();
            automovelList.innerHTML = '';
            automoveis.forEach(displayAutomovel);
        } catch (error) {
            console.error('Error:', error);
            automovelList.innerHTML = '<p>Erro ao carregar automóveis</p>';
        }
    }

    form.addEventListener('reset', () => {
        form.id.value = '';
    });

    form.addEventListener('submit', handleSubmit);
    loadCategorias();
    loadAutomoveis();
});
