document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('usuarioForm');
    const usuarioList = document.getElementById('usuarioList');
    const tipoSelect = document.getElementById('tipo');
    const orgaoGroup = document.getElementById('orgaoGroup');

    tipoSelect.addEventListener('change', () => {
        orgaoGroup.style.display = tipoSelect.value === 'FUNCIONARIO' ? 'block' : 'none';
        if (tipoSelect.value === 'COMUM') {
            form.orgao.value = '';
        }
    });

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const formData = new FormData(form);
            const data = {
                nome: formData.get('nome'),
                identidade: formData.get('identidade'),
                CNH: formData.get('CNH'),
                endereco: formData.get('endereco'),
                idade: parseInt(formData.get('idade')),
                tipo: formData.get('tipo')
            };

            if (data.tipo === 'FUNCIONARIO') {
                data.FuncionarioPublico = {
                    orgao: formData.get('orgao')
                };
            }

            if (formData.get('id')) {
                data.id = parseInt(formData.get('id'));
            }

            const method = data.id ? 'PUT' : 'POST';
            const url = data.id ? `/api/usuarios/${data.id}` : '/api/usuarios';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const usuario = await response.json();
            displayUsuario(usuario);
            form.reset();
            form.id.value = '';
            orgaoGroup.style.display = 'none';
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao salvar usuário: ' + error.message);
        }
    }

    function displayUsuario(usuario) {
        const existingItem = document.getElementById(`usuario-${usuario.id}`);
        if (existingItem) {
            existingItem.remove();
        }

        const div = document.createElement('div');
        div.id = `usuario-${usuario.id}`;
        div.className = 'categoria-item';
        div.dataset.usuario = JSON.stringify(usuario);
        div.innerHTML = `
            <div class="categoria-info">
                <strong>${usuario.nome}</strong>
                <p>Identidade: ${usuario.identidade} | CNH: ${usuario.CNH}</p>
                <p>Endereço: ${usuario.endereco}</p>
                <p>Idade: ${usuario.idade} | Tipo: ${usuario.tipo}</p>
                ${usuario.FuncionarioPublico ? `<p>Órgão: ${usuario.FuncionarioPublico.orgao}</p>` : ''}
            </div>
            <div class="categoria-actions">
                <button type="button" onclick="editUsuario(${usuario.id})">Editar</button>
                <button type="button" onclick="deleteUsuario(${usuario.id})">Deletar</button>
            </div>
        `;
        usuarioList.appendChild(div);
    }

    window.editUsuario = (id) => {
        try {
            const usuarioDiv = document.getElementById(`usuario-${id}`);
            const usuario = JSON.parse(usuarioDiv.dataset.usuario);
            
            form.id.value = usuario.id;
            form.nome.value = usuario.nome;
            form.identidade.value = usuario.identidade;
            form.CNH.value = usuario.CNH;
            form.endereco.value = usuario.endereco;
            form.idade.value = usuario.idade;
            form.tipo.value = usuario.tipo;
            
            if (usuario.FuncionarioPublico) {
                form.orgao.value = usuario.FuncionarioPublico.orgao;
                orgaoGroup.style.display = 'block';
            } else {
                form.orgao.value = '';
                orgaoGroup.style.display = 'none';
            }
            
            form.scrollIntoView({ behavior: 'smooth' });
            form.nome.focus();
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao editar usuário');
        }
    };

    window.deleteUsuario = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
        
        try {
            const response = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Erro ao excluir usuário');
            document.getElementById(`usuario-${id}`).remove();
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao excluir usuário: ' + error.message);
        }
    };

    async function loadUsuarios() {
        try {
            usuarioList.innerHTML = '<p>Carregando usuários...</p>';
            const response = await fetch('/api/usuarios');
            if (!response.ok) throw new Error('Erro ao carregar usuários');
            const usuarios = await response.json();
            usuarioList.innerHTML = '';
            usuarios.forEach(displayUsuario);
        } catch (error) {
            console.error('Error:', error);
            usuarioList.innerHTML = '<p>Erro ao carregar usuários</p>';
        }
    }

    form.addEventListener('reset', () => {
        form.id.value = '';
        orgaoGroup.style.display = 'none';
    });

    form.addEventListener('submit', handleSubmit);
    loadUsuarios();
});
