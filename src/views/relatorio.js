document.addEventListener('DOMContentLoaded', () => {
    loadVeiculos();
    loadCategorias();
});

async function loadVeiculos() {
    try {
        const response = await fetch('/api/veiculos');
        const veiculos = await response.json();
        const select = document.getElementById('veiculo_id');
        select.innerHTML = '<option value="">Selecione um veículo</option>';
        veiculos.forEach(veiculo => {
            select.innerHTML += `
                <option value="${veiculo.id}">
                    ${veiculo.marca} ${veiculo.modelo} - ${veiculo.placa}
                </option>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar veículos:', error);
    }
}

async function loadCategorias() {
    try {
        const response = await fetch('/api/categorias');
        const categorias = await response.json();
        const select = document.getElementById('categoria_id');
        select.innerHTML = '<option value="">Todas as categorias</option>';
        categorias.forEach(categoria => {
            select.innerHTML += `
                <option value="${categoria.id}">${categoria.nome}</option>
            `;
        });
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

window.gerarRelatorioLocacoes = async () => {
    const dataInicio = document.getElementById('data_inicio').value;
    const dataFim = document.getElementById('data_fim').value;
    
    if (!dataInicio || !dataFim) {
        alert('Por favor, selecione as datas inicial e final');
        return;
    }

    try {
        const container = document.getElementById('locacoesReport');
        container.innerHTML = '<p>Carregando relatório...</p>';
        
        const response = await fetch(`/api/relatorios/locacoes?inicio=${dataInicio}&fim=${dataFim}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.length === 0) {
            container.innerHTML = '<p>Nenhuma locação encontrada no período selecionado.</p>';
            return;
        }

        let html = '<table class="report-table">';
        html += `
            <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Veículo</th>
                <th>Categoria</th>
                <th>Valor Diária</th>
            </tr>
        `;
        
        data.forEach(locacao => {
            html += `
                <tr>
                    <td>${new Date(locacao.data_hora).toLocaleDateString()}</td>
                    <td>${locacao.usuario.nome}</td>
                    <td>${locacao.automovel.marca} ${locacao.automovel.modelo}</td>
                    <td>${locacao.automovel.categoria.nome}</td>
                    <td>R$ ${locacao.automovel.categoria.preco_diaria.toFixed(2)}</td>
                </tr>
            `;
        });
        
        html += '</table>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        document.getElementById('locacoesReport').innerHTML = 
            '<p class="error-message">Erro ao gerar relatório. Tente novamente.</p>';
    }
};

window.gerarRelatorioConcertos = async () => {
    const veiculoId = document.getElementById('veiculo_id').value;
    
    if (!veiculoId) {
        alert('Por favor, selecione um veículo');
        return;
    }

    try {
        const container = document.getElementById('concertosReport');
        container.innerHTML = '<p>Carregando relatório...</p>';
        
        const response = await fetch(`/api/relatorios/concertos/${veiculoId}`);
        const data = await response.json();
        
        let total = 0;
        let html = '<table class="report-table">';
        html += `
            <tr>
                <th>Data</th>
                <th>Oficina</th>
                <th>Descrição</th>
                <th>Valor</th>
            </tr>
        `;
        
        data.forEach(concerto => {
            total += concerto.valor;
            html += `
                <tr>
                    <td>${new Date(concerto.data).toLocaleDateString()}</td>
                    <td>${concerto.oficina}</td>
                    <td>${concerto.descricao}</td>
                    <td>R$ ${concerto.valor.toFixed(2)}</td>
                </tr>
            `;
        });
        
        html += `
            <tr class="total-row">
                <td colspan="3">Total</td>
                <td>R$ ${total.toFixed(2)}</td>
            </tr>
        </table>`;
        container.innerHTML = html;
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        document.getElementById('concertosReport').innerHTML = 
            '<p class="error-message">Erro ao gerar relatório. Tente novamente.</p>';
    }
};

window.gerarRelatorioVeiculos = async () => {
    const categoriaId = document.getElementById('categoria_id').value;
    
    try {
        const response = await fetch(`/api/relatorios/veiculos${categoriaId ? `?categoria=${categoriaId}` : ''}`);
        const data = await response.json();
        
        const container = document.getElementById('veiculosReport');
        let html = '<table class="report-table">';
        html += `
            <tr>
                <th>Categoria</th>
                <th>Veículo</th>
                <th>Placa</th>
                <th>Ano</th>
                <th>Exclusivo</th>
            </tr>
        `;
        
        data.forEach(veiculo => {
            html += `
                <tr>
                    <td>${veiculo.categoria.nome}</td>
                    <td>${veiculo.marca} ${veiculo.modelo}</td>
                    <td>${veiculo.placa}</td>
                    <td>${veiculo.ano}</td>
                    <td>${veiculo.categoria.exclusividade_funcionarios ? 'Sim' : 'Não'}</td>
                </tr>
            `;
        });
        
        html += '</table>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
    }
};
