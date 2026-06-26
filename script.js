// Estruturas de dados principais
let clientes = [];
let animais = [];
let servicos = [];
let movimentacoes = [];

// Funções para gerar IDs únicos
function gerarId(array) {
  return array.length > 0 ? Math.max(...array.map(e => e.id)) + 1 : 1;
}

// Função para salvar e carregar do localStorage
function salvarDados() {
  localStorage.setItem('clientes', JSON.stringify(clientes));
  localStorage.setItem('animais', JSON.stringify(animais));
  localStorage.setItem('servicos', JSON.stringify(servicos));
  localStorage.setItem('movimentacoes', JSON.stringify(movimentacoes));
}

function carregarDados() {
  clientes = JSON.parse(localStorage.getItem('clientes')) || [];
  animais = JSON.parse(localStorage.getItem('animais')) || [];
  servicos = JSON.parse(localStorage.getItem('servicos')) || [];
  movimentacoes = JSON.parse(localStorage.getItem('movimentacoes')) || [];
}

// Validação de CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

// Validação de data de nascimento (não pode ser futura)
function validarDataNascimento(data) {
  const hoje = new Date();
  const dataNasc = new Date(data);
  return dataNasc <= hoje;
}

// Inicialização
carregarDados();

// Renderização da tabela de clientes
function renderizarClientes() {
  let html = `<div class="table-responsive"><table class="table table-striped table-bordered"><thead><tr><th>ID</th><th>Nome</th><th>CPF</th><th>Telefone</th><th>Ações</th></tr></thead><tbody>`;
  if (clientes.length === 0) {
    html += '<tr><td colspan="5" class="text-center">Nenhum cliente cadastrado.</td></tr>';
  } else {
    clientes.forEach(cliente => {
      html += `<tr>
        <td>${cliente.id}</td>
        <td>${cliente.nome}</td>
        <td>${cliente.cpf}</td>
        <td>${cliente.telefone}</td>
        <td>
          <button class="btn btn-sm btn-info mr-1" onclick="editarCliente(${cliente.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="excluirCliente(${cliente.id})">Excluir</button>
        </td>
      </tr>`;
    });
  }
  html += '</tbody></table></div>';
  document.getElementById('clientesTableContainer').innerHTML = html;
}

// Limpa e abre o modal para novo cliente
function novoCliente() {
  document.getElementById('formCliente').reset();
  document.getElementById('clienteId').value = '';
  $('#clienteModal').modal('show');
}

document.querySelector('[data-target="#clienteModal"]').addEventListener('click', novoCliente);

// Preenche o modal para edição
function editarCliente(id) {
  const cliente = clientes.find(c => c.id === id);
  if (!cliente) return;
  document.getElementById('clienteId').value = cliente.id;
  document.getElementById('clienteNome').value = cliente.nome;
  document.getElementById('clienteCPF').value = cliente.cpf;
  document.getElementById('clienteTelefone').value = cliente.telefone;
  $('#clienteModal').modal('show');
}

// Exclui cliente
function excluirCliente(id) {
  if (confirm('Deseja realmente excluir este cliente?')) {
    clientes = clientes.filter(c => c.id !== id);
    salvarDados();
    renderizarClientes();
  }
}

// Validação e submissão do formulário de cliente
const formCliente = document.getElementById('formCliente');
formCliente.addEventListener('submit', function(event) {
  event.preventDefault();
  let valido = true;
  // Nome
  const nome = document.getElementById('clienteNome');
  if (!nome.value.trim()) {
    nome.classList.add('is-invalid');
    valido = false;
  } else {
    nome.classList.remove('is-invalid');
  }
  // CPF
  const cpf = document.getElementById('clienteCPF');
  if (!validarCPF(cpf.value)) {
    cpf.classList.add('is-invalid');
    valido = false;
  } else {
    cpf.classList.remove('is-invalid');
  }
  // Telefone
  const telefone = document.getElementById('clienteTelefone');
  if (!telefone.value.trim()) {
    telefone.classList.add('is-invalid');
    valido = false;
  } else {
    telefone.classList.remove('is-invalid');
  }
  if (!valido) return;
  // Salvar ou atualizar
  const id = document.getElementById('clienteId').value;
  if (id) {
    // Editar
    const idx = clientes.findIndex(c => c.id == id);
    if (idx !== -1) {
      clientes[idx].nome = nome.value.trim();
      clientes[idx].cpf = cpf.value.trim();
      clientes[idx].telefone = telefone.value.trim();
    }
  } else {
    // Novo
    clientes.push({
      id: gerarId(clientes),
      nome: nome.value.trim(),
      cpf: cpf.value.trim(),
      telefone: telefone.value.trim()
    });
  }
  salvarDados();
  renderizarClientes();
  $('#clienteModal').modal('hide');
});

// Inicialização da tabela ao carregar
renderizarClientes();

// Renderização da tabela de animais
function renderizarAnimais() {
  let html = `<div class="table-responsive"><table class="table table-striped table-bordered"><thead><tr><th>ID</th><th>Nome</th><th>Raça</th><th>Espécie</th><th>Data Nasc.</th><th>Ações</th></tr></thead><tbody>`;
  if (animais.length === 0) {
    html += '<tr><td colspan="6" class="text-center">Nenhum animal cadastrado.</td></tr>';
  } else {
    animais.forEach(animal => {
      html += `<tr>
        <td>${animal.id}</td>
        <td>${animal.nome}</td>
        <td>${animal.raca}</td>
        <td>${animal.especie}</td>
        <td>${animal.dataNascimento}</td>
        <td>
          <button class="btn btn-sm btn-info mr-1" onclick="editarAnimal(${animal.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="excluirAnimal(${animal.id})">Excluir</button>
        </td>
      </tr>`;
    });
  }
  html += '</tbody></table></div>';
  document.getElementById('animaisTableContainer').innerHTML = html;
}

// Limpa e abre o modal para novo animal
function novoAnimal() {
  document.getElementById('formAnimal').reset();
  document.getElementById('animalId').value = '';
  $('#animalModal').modal('show');
}

document.querySelector('[data-target="#animalModal"]').addEventListener('click', novoAnimal);

// Preenche o modal para edição
function editarAnimal(id) {
  const animal = animais.find(a => a.id === id);
  if (!animal) return;
  document.getElementById('animalId').value = animal.id;
  document.getElementById('animalNome').value = animal.nome;
  document.getElementById('animalRaca').value = animal.raca;
  document.getElementById('animalEspecie').value = animal.especie;
  document.getElementById('animalDataNascimento').value = animal.dataNascimento;
  $('#animalModal').modal('show');
}

// Exclui animal
function excluirAnimal(id) {
  if (confirm('Deseja realmente excluir este animal?')) {
    animais = animais.filter(a => a.id !== id);
    salvarDados();
    renderizarAnimais();
  }
}

// Validação e submissão do formulário de animal
const formAnimal = document.getElementById('formAnimal');
formAnimal.addEventListener('submit', function(event) {
  event.preventDefault();
  let valido = true;
  // Nome
  const nome = document.getElementById('animalNome');
  if (!nome.value.trim()) {
    nome.classList.add('is-invalid');
    valido = false;
  } else {
    nome.classList.remove('is-invalid');
  }
  // Raça
  const raca = document.getElementById('animalRaca');
  if (!raca.value.trim()) {
    raca.classList.add('is-invalid');
    valido = false;
  } else {
    raca.classList.remove('is-invalid');
  }
  // Espécie
  const especie = document.getElementById('animalEspecie');
  if (!especie.value.trim()) {
    especie.classList.add('is-invalid');
    valido = false;
  } else {
    especie.classList.remove('is-invalid');
  }
  // Data de nascimento
  const dataNasc = document.getElementById('animalDataNascimento');
  if (!validarDataNascimento(dataNasc.value)) {
    dataNasc.classList.add('is-invalid');
    valido = false;
  } else {
    dataNasc.classList.remove('is-invalid');
  }
  if (!valido) return;
  // Salvar ou atualizar
  const id = document.getElementById('animalId').value;
  if (id) {
    // Editar
    const idx = animais.findIndex(a => a.id == id);
    if (idx !== -1) {
      animais[idx].nome = nome.value.trim();
      animais[idx].raca = raca.value.trim();
      animais[idx].especie = especie.value.trim();
      animais[idx].dataNascimento = dataNasc.value;
    }
  } else {
    // Novo
    animais.push({
      id: gerarId(animais),
      nome: nome.value.trim(),
      raca: raca.value.trim(),
      especie: especie.value.trim(),
      dataNascimento: dataNasc.value
    });
  }
  salvarDados();
  renderizarAnimais();
  $('#animalModal').modal('hide');
});

// Inicialização da tabela ao carregar
renderizarAnimais();

// Renderização da tabela de serviços
function renderizarServicos() {
  let html = `<div class="table-responsive"><table class="table table-striped table-bordered"><thead><tr><th>ID</th><th>Descrição</th><th>Preço (R$)</th><th>Ações</th></tr></thead><tbody>`;
  if (servicos.length === 0) {
    html += '<tr><td colspan="4" class="text-center">Nenhum serviço cadastrado.</td></tr>';
  } else {
    servicos.forEach(servico => {
      html += `<tr>
        <td>${servico.id}</td>
        <td>${servico.descricao}</td>
        <td>${parseFloat(servico.preco).toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-info mr-1" onclick="editarServico(${servico.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="excluirServico(${servico.id})">Excluir</button>
        </td>
      </tr>`;
    });
  }
  html += '</tbody></table></div>';
  document.getElementById('servicosTableContainer').innerHTML = html;
}

// Limpa e abre o modal para novo serviço
function novoServico() {
  document.getElementById('formServico').reset();
  document.getElementById('servicoId').value = '';
  $('#servicoModal').modal('show');
}

document.querySelector('[data-target="#servicoModal"]').addEventListener('click', novoServico);

// Preenche o modal para edição
function editarServico(id) {
  const servico = servicos.find(s => s.id === id);
  if (!servico) return;
  document.getElementById('servicoId').value = servico.id;
  document.getElementById('servicoDescricao').value = servico.descricao;
  document.getElementById('servicoPreco').value = servico.preco;
  $('#servicoModal').modal('show');
}

// Exclui serviço
function excluirServico(id) {
  if (confirm('Deseja realmente excluir este serviço?')) {
    servicos = servicos.filter(s => s.id !== id);
    salvarDados();
    renderizarServicos();
  }
}

// Validação e submissão do formulário de serviço
const formServico = document.getElementById('formServico');
formServico.addEventListener('submit', function(event) {
  event.preventDefault();
  let valido = true;
  // Descrição
  const descricao = document.getElementById('servicoDescricao');
  if (!descricao.value.trim()) {
    descricao.classList.add('is-invalid');
    valido = false;
  } else {
    descricao.classList.remove('is-invalid');
  }
  // Preço
  const preco = document.getElementById('servicoPreco');
  if (!preco.value || parseFloat(preco.value) < 0) {
    preco.classList.add('is-invalid');
    valido = false;
  } else {
    preco.classList.remove('is-invalid');
  }
  if (!valido) return;
  // Salvar ou atualizar
  const id = document.getElementById('servicoId').value;
  if (id) {
    // Editar
    const idx = servicos.findIndex(s => s.id == id);
    if (idx !== -1) {
      servicos[idx].descricao = descricao.value.trim();
      servicos[idx].preco = parseFloat(preco.value).toFixed(2);
    }
  } else {
    // Novo
    servicos.push({
      id: gerarId(servicos),
      descricao: descricao.value.trim(),
      preco: parseFloat(preco.value).toFixed(2)
    });
  }
  salvarDados();
  renderizarServicos();
  $('#servicoModal').modal('hide');
});

// Inicialização da tabela ao carregar
renderizarServicos();

// Renderização da tabela de movimentações
function renderizarMovimentacoes() {
  let html = `<div class="table-responsive"><table class="table table-striped table-bordered"><thead><tr><th>ID</th><th>Cliente</th><th>Animal</th><th>Serviços</th><th>Total (R$)</th><th>Ações</th></tr></thead><tbody>`;
  if (movimentacoes.length === 0) {
    html += '<tr><td colspan="6" class="text-center">Nenhuma movimentação cadastrada.</td></tr>';
  } else {
    movimentacoes.forEach(mov => {
      const cliente = clientes.find(c => c.id === mov.clienteId);
      const animal = animais.find(a => a.id === mov.animalId);
      const servs = mov.servicosIds.map(id => {
        const s = servicos.find(sv => sv.id === id);
        return s ? s.descricao : '';
      }).join(', ');
      html += `<tr>
        <td>${mov.id}</td>
        <td>${cliente ? cliente.nome : '-'}</td>
        <td>${animal ? animal.nome : '-'}</td>
        <td>${servs}</td>
        <td>${parseFloat(mov.total).toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-info mr-1" onclick="editarMovimentacao(${mov.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="excluirMovimentacao(${mov.id})">Excluir</button>
        </td>
      </tr>`;
    });
  }
  html += '</tbody></table></div>';
  document.getElementById('movimentacoesTableContainer').innerHTML = html;
}

// Preenche selects do modal de movimentação
function preencherSelectsMovimentacao() {
  // Clientes
  const selCliente = document.getElementById('movCliente');
  selCliente.innerHTML = '<option value="">Selecione</option>' + clientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
  // Animais
  const selAnimal = document.getElementById('movAnimal');
  selAnimal.innerHTML = '<option value="">Selecione</option>' + animais.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');
  // Serviços
  const selServicos = document.getElementById('movServicos');
  selServicos.innerHTML = servicos.map(s => `<option value="${s.id}">${s.descricao} (R$ ${parseFloat(s.preco).toFixed(2)})</option>`).join('');
}

// Limpa e abre o modal para nova movimentação
function novaMovimentacao() {
  document.getElementById('formMovimentacao').reset();
  document.getElementById('movimentacaoId').value = '';
  document.getElementById('movTotal').value = '';
  preencherSelectsMovimentacao();
  $('#movimentacaoModal').modal('show');
}

document.querySelector('[data-target="#movimentacaoModal"]').addEventListener('click', novaMovimentacao);

document.getElementById('movServicos').addEventListener('change', calcularTotalMovimentacao);
document.getElementById('movCliente').addEventListener('change', function() {
  // Opcional: filtrar animais do cliente
});

// Preenche o modal para edição
function editarMovimentacao(id) {
  const mov = movimentacoes.find(m => m.id === id);
  if (!mov) return;
  preencherSelectsMovimentacao();
  document.getElementById('movimentacaoId').value = mov.id;
  document.getElementById('movCliente').value = mov.clienteId;
  document.getElementById('movAnimal').value = mov.animalId;
  Array.from(document.getElementById('movServicos').options).forEach(opt => {
    opt.selected = mov.servicosIds.includes(Number(opt.value));
  });
  document.getElementById('movTotal').value = parseFloat(mov.total).toFixed(2);
  $('#movimentacaoModal').modal('show');
}

// Exclui movimentação
function excluirMovimentacao(id) {
  if (confirm('Deseja realmente excluir esta movimentação?')) {
    movimentacoes = movimentacoes.filter(m => m.id !== id);
    salvarDados();
    renderizarMovimentacoes();
  }
}

// Calcula o total dos serviços selecionados
function calcularTotalMovimentacao() {
  const sel = document.getElementById('movServicos');
  let total = 0;
  Array.from(sel.selectedOptions).forEach(opt => {
    const serv = servicos.find(s => s.id === Number(opt.value));
    if (serv) total += parseFloat(serv.preco);
  });
  document.getElementById('movTotal').value = total.toFixed(2);
}

// Validação e submissão do formulário de movimentação
const formMovimentacao = document.getElementById('formMovimentacao');
formMovimentacao.addEventListener('submit', function(event) {
  event.preventDefault();
  let valido = true;
  // Cliente
  const cliente = document.getElementById('movCliente');
  if (!cliente.value) {
    cliente.classList.add('is-invalid');
    valido = false;
  } else {
    cliente.classList.remove('is-invalid');
  }
  // Animal
  const animal = document.getElementById('movAnimal');
  if (!animal.value) {
    animal.classList.add('is-invalid');
    valido = false;
  } else {
    animal.classList.remove('is-invalid');
  }
  // Serviços
  const servicosSel = document.getElementById('movServicos');
  if (servicosSel.selectedOptions.length === 0) {
    servicosSel.classList.add('is-invalid');
    valido = false;
  } else {
    servicosSel.classList.remove('is-invalid');
  }
  if (!valido) return;
  // Salvar ou atualizar
  const id = document.getElementById('movimentacaoId').value;
  const servicosIds = Array.from(servicosSel.selectedOptions).map(opt => Number(opt.value));
  const total = document.getElementById('movTotal').value;
  if (id) {
    // Editar
    const idx = movimentacoes.findIndex(m => m.id == id);
    if (idx !== -1) {
      movimentacoes[idx].clienteId = Number(cliente.value);
      movimentacoes[idx].animalId = Number(animal.value);
      movimentacoes[idx].servicosIds = servicosIds;
      movimentacoes[idx].total = total;
    }
  } else {
    // Novo
    movimentacoes.push({
      id: gerarId(movimentacoes),
      clienteId: Number(cliente.value),
      animalId: Number(animal.value),
      servicosIds,
      total
    });
  }
  salvarDados();
  renderizarMovimentacoes();
  $('#movimentacaoModal').modal('hide');
});

// Inicialização da tabela ao carregar
renderizarMovimentacoes();

// ... Funções de CRUD e renderização serão implementadas a seguir ... 