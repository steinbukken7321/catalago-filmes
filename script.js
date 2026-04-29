// --- INICIALIZAÇÃO DE DADOS ---
// Tenta carregar os dados salvos no navegador. Se não existirem, usa os dados iniciais do Python.
let db = JSON.parse(localStorage.getItem('meuDB')) || dbInicial;
let logs = JSON.parse(localStorage.getItem('meuLog')) || [];
let memorias = JSON.parse(localStorage.getItem('minhasMemorias')) || [];

/**
 * Registra uma ação no histórico (Log).
 * @param {string} msg - A mensagem descrevendo o que aconteceu.
 */
function registrarLog(msg) {
    const data = new Date().toLocaleString('pt-BR'); // Pega data e hora atual
    logs.unshift({ data, acao: msg }); // Adiciona no início da lista (mais recente primeiro)
    // Salva apenas os últimos 50 registros para não sobrecarregar a memória
    localStorage.setItem('meuLog', JSON.stringify(logs.slice(0, 50)));
}

/**
 * Gerencia a lista de filmes assistidos (Memórias).
 */
function registrarMemoria(nome, cat, status) {
    const data = new Date().toLocaleString('pt-BR');
    if(status === 'visto') {
        memorias.unshift({ data, nome, cat }); // Adiciona às memórias
    } else {
        // Se desmarcar o filme, remove ele da lista de memórias pelo nome
        memorias = memorias.filter(m => m.nome !== nome);
    }
    localStorage.setItem('minhasMemorias', JSON.stringify(memorias));
}

/**
 * Controla a exibição das janelas flutuantes (Log e Memórias).
 */
function abrirModal(id) {
    // Define qual lista de dados mostrar baseada no ID do modal aberto
    const lista = (id === 'modal-log') ? document.getElementById('lista-logs') : document.getElementById('lista-memorias');
    const dados = (id === 'modal-log') ? logs : memorias;
    
    // Gera o HTML da lista dinamicamente
    lista.innerHTML = dados.map(d => `
        <div style="border-bottom:1px solid #555; padding:12px;">
            <small>${d.data}</small> - ${d.acao || '<b>'+d.nome+'</b> ('+d.cat+')'}
        </div>
    `).join('') || "Vazio";
    
    document.getElementById(id).style.display = 'block'; // Torna o modal visível
}

// Fecha o modal apenas se o usuário clicar no fundo escuro (fora da caixa branca)
function fecharModal(e, id) { 
    if(e.target.id === id) document.getElementById(id).style.display = 'none'; 
}

// Limpa os dados do navegador (logs ou memórias) após confirmação do usuário
function limparStorage(key) { 
    if(confirm("Confirmar limpeza?")) { 
        localStorage.removeItem(key); 
        location.reload(); // Recarrega a página para atualizar a interface
    } 
}

/**
 * Alterna entre Modo Claro e Modo Escuro.
 */
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light'); // Salva a preferência do usuário
}

/**
 * Salva o banco de dados de filmes no navegador e atualiza a tela.
 */
function salvarDB() { 
    localStorage.setItem('meuDB', JSON.stringify(db)); 
    renderizarTudo(); 
}

/**
 * Lógica para adicionar um novo filme à categoria selecionada.
 */
function adicionarFilme() {
    const cat = document.getElementById('sel-cat-add').value;
    const nome = document.getElementById('input-add').value.trim();
    
    if(nome && cat) {
        db[cat].filmes.push(nome); // Adiciona ao array dentro do objeto db
        registrarLog(`Adicionou: "${nome}" em ${cat}`);
        salvarDB();
        document.getElementById('input-add').value = ''; // Limpa o campo de texto
    }
}

/**
 * Remove um filme específico de uma categoria.
 */
function removerFilme() {
    const cat = document.getElementById('sel-cat-rem').value;
    const idx = document.getElementById('sel-filme-rem').value;
    
    if(cat && idx !== "") {
        const nomeFilme = db[cat].filmes[idx];
        if(confirm(`Deseja realmente remover "${nomeFilme}"?`)) {
            registrarLog(`Removeu: "${nomeFilme}"`);
            db[cat].filmes.splice(idx, 1);
            
            salvarDB(); // Esta função já renderiza a tela novamente

            // Reseta o seletor de categorias para o estado neutro
            document.getElementById('sel-cat-rem').value = ""; 
            
            // Reseta e desabilita o seletor de filmes
            const selFilme = document.getElementById('sel-filme-rem');
            selFilme.innerHTML = '<option value="">Escolha a categoria...</option>';
            selFilme.disabled = true;
            // ------------------------------------
        }
    }
}

/**
 * Atualiza o segundo menu suspenso do painel "Remover" com os filmes da categoria escolhida.
 */
function atualizarListaRemover() {
    const cat = document.getElementById('sel-cat-rem').value;
    const selFilme = document.getElementById('sel-filme-rem');
    
    if(cat) {
        selFilme.disabled = false;
        // Mapeia os filmes da categoria para opções dentro do select
        selFilme.innerHTML = db[cat].filmes.map((f,i) => `<option value="${i}">${f}</option>`).join('');
    } else {
        selFilme.disabled = true;
        selFilme.innerHTML = '<option value="">Escolha a categoria...</option>';
    }
}

/**
 * Seleciona um filme aleatório que ainda não foi marcado como "visto".
 */
function sortearFilme() {
    const catSel = document.getElementById('sel-cat-sort').value;
    let pool = []; // Lista de filmes elegíveis para o sorteio

    // Função interna que filtra apenas filmes não assistidos
    const filter = (c) => db[c].filmes.forEach(f => {
        // Gera um ID único baseado no nome do filme (Base64)
        const sId = btoa(unescape(encodeURIComponent(f))).replace(/[^a-zA-Z0-9]/g, '');
        if(!localStorage.getItem('visto-' + sId)) pool.push({f, c});
    });

    if(catSel === "TODOS") Object.keys(db).forEach(filter); else filter(catSel);

    if(pool.length > 0) {
        const s = pool[Math.floor(Math.random()*pool.length)]; // Escolha aleatória
        document.getElementById('res-sorteio').innerHTML = `<strong>${s.f}</strong><br><small>(${s.c})</small>`;
    } else {
        document.getElementById('res-sorteio').innerText = "Todos vistos!";
    }
}

/**
 * Marca ou desmarca um filme como assistido.
 */
function marcarVisto(sId, nome, cat) {
    const key = 'visto-' + sId;
    const status = localStorage.getItem(key) ? 'removido' : 'visto';
    
    if(status === 'visto') localStorage.setItem(key, 'true'); 
    else localStorage.removeItem(key);
    
    registrarLog(`${status==='visto'?'Assistiu':'Desmarcou'}: "${nome}"`);
    registrarMemoria(nome, cat, status);
    renderizarTudo(); // Re-renderiza para mudar a cor do card
}

/**
 * Faz a rolagem suave e centraliza a categoria na tela.
 */
function rolarParaCentro(evento, id) {
    evento.preventDefault(); // Impede o navegador de pular para o topo automaticamente
    const elemento = document.getElementById(id);
    
    if (elemento) {
        elemento.scrollIntoView({
            behavior: 'smooth', // Rolagem suave
            block: 'center'    // A MÁGICA ESTÁ AQUI: centraliza verticalmente
        });
    }
}

/**
 * A função principal: desenha todo o catálogo, menus e botões na tela.
 */
function renderizarTudo() {
    const menu = document.getElementById('menu-categorias');
    const conteudo = document.getElementById('conteudo-catalogo');
    const cats = Object.keys(db);

    // 1. Renderiza os botões de atalho no topo
    let htmlMenu = '<div class="cat-row">';
    cats.forEach(cat => {
        htmlMenu += `<a href="#${cat}" onclick="rolarParaCentro(event, '${cat}')" class="cat-btn" style="background:${coresMapping[cat]}">${cat.toUpperCase()}</a>`;
        // Quebra a linha após o botão "Ficção" para o menu não ficar longo demais
        if(cat === "Ficção") htmlMenu += '</div><div class="cat-row">';
    });
    menu.innerHTML = htmlMenu + '</div>';

    // 2. Renderiza os títulos das categorias e os cards dos filmes
    conteudo.innerHTML = cats.map(cat => `
        <h3 id="${cat}" class="cat-title" style="color:${coresMapping[cat]}; border-bottom:3px solid ${coresMapping[cat]};">${cat} ${db[cat].icon}</h3>
        <div class="grid">
            ${db[cat].filmes.map(f => {
                // Cria o ID único para persistência do checkbox
                const sId = btoa(unescape(encodeURIComponent(f))).replace(/[^a-zA-Z0-9]/g, '');
                const visto = localStorage.getItem('visto-'+sId) ? 'visto' : '';
                return `
                <div class="filme-card ${visto}" style="border-left-color:${coresMapping[cat]}">
                    <input type="checkbox" ${visto?'checked':''} onchange="marcarVisto('${sId}','${f}','${cat}')">
                    <span style="margin-left:15px; font-weight:600;">${f}</span>
                </div>`;
            }).join('')}
        </div>
    `).join('');

    // 3. Atualiza as opções dos menus suspensos (Selects) no painel administrativo
    const opt = cats.map(c => `<option value="${c}">${c}</option>`).join('');
    document.getElementById('sel-cat-add').innerHTML = '<option value="">Escolha...</option>' + opt;
    document.getElementById('sel-cat-rem').innerHTML = '<option value="">Escolha...</option>' + opt;
    document.getElementById('sel-cat-sort').innerHTML = '<option value="TODOS">Todas Categorias</option>' + opt;
}

// Executa assim que a página termina de carregar
window.onload = () => { 
    // Verifica se o usuário prefere o modo claro
    if(localStorage.getItem('theme')==='light') document.body.classList.remove('dark-mode');
    renderizarTudo(); 
};