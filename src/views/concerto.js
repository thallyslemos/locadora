document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('concertoForm');
    const concertoList = document.getElementById('concertoList');
    const automovelSelect = document.getElementById('automovel_id');

    async function loadAutomoveis() {
        try {
            const response = await fetch('/api/veiculos');
            const automoveis = await response.json();
            automovelSelect.innerHTML = '<option value="">Selecione um automóvel</option>';
            automoveis.forEach(automovel => {
                automovelSelect.innerHTML += `
                    <option value="${automovel.id}">
                        ${automovel.marca} ${automovel.modelo} - ${automovel.placa}
                    </option>
                `;
            });
        } catch (error) {
            console.error('Error loading automoveis:', error);
            alert('Erro ao carregar automóveis');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const formData = new FormData(form);
            const data = {
                automovel_id: parseInt(formData.get('automovel_id')),
                data: formData.get('data'),
                descricao: formData.get('descricao'),
                valor: parseFloat(formData.get('valor')),
                oficina: formData.get('oficina')
            };

            const method = formData.get('id') ? 'PUT' : 'POST';
            const url = formData.get('id') ? 
                `/api/concertos/${formData.get('id')}` : 
                '/api/concertos';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const concerto = await response.json();
            displayConcerto(concerto);
            form.reset();
            form.id.value = '';
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao salvar concerto: ' + error.message);
        }
    }

    function displayConcerto(concerto) {
        const existingItem = document.getElementById(`concerto-${concerto.id}`);
        if (existingItem) {
            existingItem.remove();
        }

        const div = document.createElement('div');
        div.id = `concerto-${concerto.id}`;
        div.className = 'categoria-item';
        div.dataset.concerto = JSON.stringify(concerto);

        const dataFormatada = new Date(concerto.data).toLocaleDateString();
        const valorFormatado = concerto.valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        div.innerHTML = `
            <div class="categoria-info">
                <strong>Concerto #${concerto.id}</strong>
                <p>Veículo: ${concerto.automovel.marca} ${concerto.automovel.modelo} - ${concerto.automovel.placa}</p>
                <p>Data: ${dataFormatada}</p>
                <p>Oficina: ${concerto.oficina}</p>
                <p>Valor: ${valorFormatado}</p>
                <p>Descrição: ${concerto.descricao}</p>
            </div>
            <div class="categoria-actions">
                <button type="button" onclick="editConcerto(${concerto.id})">Editar</button>
                <button type="button" onclick="deleteConcerto(${concerto.id})">Excluir</button>
            </div>
        `;
        concertoList.appendChild(div);
    }

    window.editConcerto = (id) => {
        try {
            const concertoDiv = document.getElementById(`concerto-${id}`);
            const concerto = JSON.parse(concertoDiv.dataset.concerto);
            
            form.id.value = concerto.id;
            form.automovel_id.value = concerto.automovel_id;
            form.data.value = concerto.data.split('T')[0];
            form.descricao.value = concerto.descricao;
            form.valor.value = concerto.valor;
            form.oficina.value = concerto.oficina;
            
            form.scrollIntoView({ behavior: 'smooth' });
            form.descricao.focus();
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao editar concerto');
        }
    };

    window.deleteConcerto = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este concerto?')) return;
        
        try {
            const response = await fetch(`/api/concertos/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Erro ao excluir concerto');
            document.getElementById(`concerto-${id}`).remove();
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao excluir concerto: ' + error.message);
        }
    };

    async function loadConcertos() {
        try {
            concertoList.innerHTML = '<p>Carregando concertos...</p>';
            const response = await fetch('/api/concertos');
            console.log(response);
            if (!response.ok) throw new Error('Erro ao carregar concertos');
            const concertos = await response.json();
            concertoList.innerHTML = '';
            concertos.forEach(displayConcerto);
        } catch (error) {
            console.error('Error:', error);
            concertoList.innerHTML = '<p>Erro ao carregar concertos</p>';
        }
    }

    form.addEventListener('reset', () => {
        form.id.value = '';
    });

    form.addEventListener('submit', handleSubmit);
    loadAutomoveis();
    loadConcertos();
});
