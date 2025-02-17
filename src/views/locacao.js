document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('locacaoForm');
    const locacaoList = document.getElementById('locacaoList');
    const usuarioSelect = document.getElementById('usuario_id');
    const automovelSelect = document.getElementById('automovel_id');

    async function loadUsuarios() {
        try {
            const response = await fetch('/api/usuarios');
            const usuarios = await response.json();
            usuarioSelect.innerHTML = '<option value="">Selecione um usuário</option>';
            usuarios.forEach(usuario => {
                usuarioSelect.innerHTML += `
                    <option value="${usuario.id}" data-tipo="${usuario.tipo}">${usuario.nome} - ${usuario.tipo}</option>
                `;
            });
        } catch (error) {
            console.error('Error loading usuarios:', error);
        }
    }

    async function loadAutomoveis() {
        try {
            const response = await fetch('/api/veiculos');
            const automoveis = await response.json();
            const categoriasResponse = await fetch('/api/categorias');
            const categorias = await categoriasResponse.json();

            automovelSelect.innerHTML = '<option value="">Selecione um automóvel</option>';
            automoveis.forEach(automovel => {
                const categoria = categorias.find(c => c.id === automovel.categoria_id);
                automovelSelect.innerHTML += `
                    <option value="${automovel.id}" 
                            data-exclusivo="${categoria?.exclusividade_funcionarios}"
                            data-categoria="${categoria?.id}">
                        ${automovel.marca} ${automovel.modelo} - ${automovel.placa}
                        ${categoria?.exclusividade_funcionarios ? ' (Exclusivo para Funcionários)' : ''}
                    </option>
                `;
            });
        } catch (error) {
            console.error('Error loading automoveis:', error);
        }
    }

    usuarioSelect.addEventListener('change', () => {
        const selectedOption = usuarioSelect.selectedOptions[0];
        const isFunc = selectedOption?.dataset.tipo === 'FUNCIONARIO';
        
        Array.from(automovelSelect.options).forEach(option => {
            const isExclusivo = option.dataset.exclusivo === 'true';
            option.disabled = isExclusivo && !isFunc;
        });
    });

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const formData = new FormData(form);
            const data = {
                usuario_id: parseInt(formData.get('usuario_id')),
                automovel_id: parseInt(formData.get('automovel_id')),
                data_hora: new Date(formData.get('data_hora')).toISOString()
            };

            const response = await fetch('/api/alugueis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao salvar locação');
            }

            const locacao = await response.json();
            displayLocacao(locacao);
            form.reset();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    }

    async function displayLocacao(locacao) {
        try {
            let usuario = locacao.usuario;
            let automovel = locacao.automovel;

            if (!usuario || !automovel) {
                const [usuarioResponse, automovelResponse] = await Promise.all([
                    fetch(`/api/usuarios/${locacao.usuario_id}`),
                    fetch(`/api/veiculos/${locacao.automovel_id}`)
                ]);

                if (!usuarioResponse.ok || !automovelResponse.ok) {
                    throw new Error('Erro ao buscar detalhes da locação');
                }

                usuario = await usuarioResponse.json();
                automovel = await automovelResponse.json();
            }

            const div = document.createElement('div');
            div.id = `locacao-${locacao.id}`;
            div.className = 'categoria-item';
            div.innerHTML = `
                <div class="categoria-info">
                    <strong>Locação #${locacao.id}</strong>
                    <p>Cliente: ${usuario.nome}</p>
                    <p>Veículo: ${automovel.marca} ${automovel.modelo} - ${automovel.placa}</p>
                    <p>Data: ${new Date(locacao.data_hora).toLocaleString()}</p>
                </div>
                <div class="categoria-actions">
                    <button type="button" onclick="deleteLocacao(${locacao.id})">Cancelar</button>
                </div>
            `;
            locacaoList.appendChild(div);
        } catch (error) {
            console.error('Error displaying locacao:', error);
            // Criar elemento mesmo com erro, mas mostrar mensagem de erro
            const div = document.createElement('div');
            div.id = `locacao-${locacao.id}`;
            div.className = 'categoria-item error';
            div.innerHTML = `
                <div class="categoria-info">
                    <strong>Locação #${locacao.id}</strong>
                    <p>Erro ao carregar detalhes</p>
                    <p>Data: ${new Date(locacao.data_hora).toLocaleString()}</p>
                </div>
                <div class="categoria-actions">
                    <button type="button" onclick="deleteLocacao(${locacao.id})">Cancelar</button>
                </div>
            `;
            locacaoList.appendChild(div);
        }
    }

    window.deleteLocacao = async (id) => {
        if (!confirm('Tem certeza que deseja cancelar esta locação?')) return;
        
        try {
            const response = await fetch(`/api/alugueis/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Erro ao cancelar locação');
            document.getElementById(`locacao-${id}`).remove();
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao cancelar locação: ' + error.message);
        }
    };

    async function loadAlugueis() {
        try {
            locacaoList.innerHTML = '<p>Carregando locações...</p>';
            const response = await fetch('/api/alugueis');
            if (!response.ok) throw new Error('Erro ao carregar locações');
            const alugueis = await response.json();
            locacaoList.innerHTML = '';
            
            // Processar cada locação sequencialmente para evitar problemas de concorrência
            for (const aluguel of alugueis) {
                await displayLocacao(aluguel);
            }
        } catch (error) {
            console.error('Error:', error);
            locacaoList.innerHTML = '<p>Erro ao carregar locações</p>';
        }
    }

    form.addEventListener('submit', handleSubmit);
    loadUsuarios();
    loadAutomoveis();
    loadAlugueis();
});
