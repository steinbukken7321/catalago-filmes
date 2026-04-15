# -*- coding: utf-8 -*-
import json
import base64

# --- [DADOS E CONFIGURAÇÕES] ---
cor_banner_inicio = "#1a1a1a"
cor_banner_fim = "#2c3e50"

filmes_storage = {
    "Criminal": {"icon": "🔪", "filmes": ["Murder on the Orient Express", "Pulp Fiction", "O agente secreto", "O Colecionador de Ossos"]},
    "Suspense": {"icon": "😰", "filmes": ["Don’t move", "Foi apenas um acidente", "O enfermeiro da noite", "Oito mulheres e um segredo"]},
    "Drama": {"icon": "🎭", "filmes": ["Nomadland", "Vidas Passadas", "O último azul", "Paradise"]},
    "+18": {"icon": "🔞", "filmes": ["A empregada", "Me chame pelo seu nome", "Sex/Life", "Azul é a cor mais quente"]},
    "Documentário": {"icon": "📽️", "filmes": ["Dear Zachary", "Planet Earth", "Alphago", "Age of Samurai"]},
    "Aventura": {"icon": "🧗", "filmes": ["Uncharted", "Fúria de titãs 1 e 2", "Predador", "Kaguya"]},
    "Guerra": {"icon": "⚔️", "filmes": ["Até o último homem", "O resgate do soldado ryan", "A Lista de Schindler", "1917"]},
    "Fantasia": {"icon": "🧙", "filmes": ["Avatar", "Frankenstein", "O troll da montanha", "A torre negra"]},
    "Ficção": {"icon": "👽", "filmes": ["Ruptura", "A grande inundação", "Spaceman", "2001: A Space Odyssey"]},
    "Romance": {"icon": "❤️", "filmes": ["Todo tempo que temos", "O prisma do amor", "Meu Eterno Talvez", "303"]},
    "Comédia Romântica": {"icon": "🥰", "filmes": ["10 Things I Hate About You", "Columbus", "Sleeping with Other People", "The big sick"]},
    "Comédia": {"icon": "😂", "filmes": ["Queime Depois de Ler", "O Dublê", "Residence", "O fantástico senhor raposo"]},
    "Animação": {"icon": "🎨", "filmes": ["Zootopia 2", "Aranhaverso 2", "Cowboy Bebop", "Sussurros do Coração"]},
    "Ação": {"icon": "💥", "filmes": ["Pecadores", "Classe dos herois fracos", "CasHero", "Máquina de guerra"]},
    "Asiático": {"icon": "🍜", "filmes": ["Alquimia das almas", "Se esse amor desaparecesse hoje", "The Handmaiden", "I Want to Eat Your Pancreas"]},
    "Terror": {"icon": "👻", "filmes": ["Donnie darko", "A hora do mal", "It a coisa", "O Iluminado"]},
    "Musical": {"icon": "🎵", "filmes": ["La la land", "Mamma Mia!", "Os Miseráveis", "O Rei do Show"]}
}

cores_lista = ["#e50914", "#ff9800", "#9c27b0", "#333333", "#009688", "#2196f3", "#795548", "#607d8b", "#4caf50", "#e91e63", "#00bcd4", "#673ab7", "#ffc107", "#3f51b5", "#8bc34a", "#f44336", "#00d2ff"]
mapeamento_cores = {cat: cores_lista[i % len(cores_lista)] for i, cat in enumerate(filmes_storage.keys())}

# --- [HTML BASE] ---
html_base = f'''
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catálogo de Filmes</title>
    <link rel="stylesheet" href="style.css">
</head>
<body id="topo" class="dark-mode">
    <div class="banner-fino">
        <h1>MEU CATÁLOGO DE FILMES</h1>
        <button onclick="toggleTheme()" id="btn-theme">🌓 MODO</button>
    </div>

    <button class="btn-side btn-memo" onclick="abrirModal('modal-memo')">MEMÓRIAS 🧡</button>
    <button class="btn-side btn-log" onclick="abrirModal('modal-log')">LOG 📋</button>
    <a href="#topo" class="btn-topo">↑</a>

    <div class="admin-panel">
        <div class="admin-box">
            <strong style="color: #4caf50;">➕ ADICIONAR</strong>
            <select id="sel-cat-add"></select>
            <input type="text" id="input-add" placeholder="Nome do filme...">
            <button class="btn-painel" onclick="adicionarFilme()" style="background:#4caf50;">SALVAR </button>
        </div>
        <div class="admin-box" style="border-left: 2px solid #555; border-right: 2px solid #555; padding: 0 25px;">
            <strong style="color: #f44336;">➖ REMOVER</strong>
            <select id="sel-cat-rem" onchange="atualizarListaRemover()"></select>
            <select id="sel-filme-rem" disabled><option value="">Escolha a categoria...</option></select>
            <button class="btn-painel" onclick="removerFilme()" style="background:#f44336;">DELETAR</button>
        </div>
        <div class="admin-box">
            <strong style="color: #2196f3;">🎲 SORTEAR</strong>
            <select id="sel-cat-sort"></select>
            <button class="btn-painel" onclick="sortearFilme()" style="background:#2196f3;">O QUE ASSISTIR?</button>
            <div id="res-sorteio"></div>
        </div>
    </div>

    <div id="menu-categorias"></div>
    <div class="container" id="conteudo-catalogo"></div>

    <div id="modal-log" class="modal" onclick="fecharModal(event, 'modal-log')">
        <div class="modal-content">
            <h2>Histórico</h2>
            <div id="lista-logs"></div>
            <button onclick="limparStorage('meuLog')" class="btn-limpar">LIMPAR LOGS</button>
        </div>
    </div>

    <div id="modal-memo" class="modal" onclick="fecharModal(event, 'modal-memo')">
        <div class="modal-content">
            <h2>🎬 Memórias</h2>
            <div id="lista-memorias"></div>
        </div>
    </div>

    <script>
        const dbInicial = REPLACE_DB_INICIAL;
        const coresMapping = REPLACE_CORES;
    </script>
    <script src="script.js"></script>
</body>
</html>
'''

html_final = html_base.replace('REPLACE_DB_INICIAL', json.dumps(filmes_storage)).replace('REPLACE_CORES', json.dumps(mapeamento_cores))

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html_final)

print("Arquivo 'index.html' gerado com sucesso!")