# 🎬 Movie Manager: Catálogo Inteligente & Sorteador

O **Movie Manager** é uma aplicação interativa de página única (**SPA**) projetada para o gerenciamento pessoal de acervos cinematográficos. O projeto une a robustez da estruturação de dados em **Python** com a agilidade de uma interface reativa em **JavaScript**, focando em persistência *client-side* e uma experiência de usuário (UX) fluida.

---

## 🚀 Funcionalidades de Destaque

* **Gerenciamento Dinâmico (CRUD):** Interface intuitiva para adição e remoção de títulos por categoria em tempo real.
* **Sorteador Inteligente:** Algoritmo que utiliza filtragem de status para ignorar filmes marcados como "vistos" e histórico de sessão para evitar repetições consecutivas.
* **Persistência Local:** Implementação da **Web Storage API (LocalStorage)**, garantindo que os dados e marcações permaneçam salvos no navegador sem a necessidade de um banco de dados externo.
* **UI/UX Refinada:**
    * **Modo Escuro/Claro:** Alternância dinâmica de temas com salvamento automático da preferência do usuário.
    * **Scroll Inteligente:** Navegação por âncoras que centraliza a categoria selecionada no meio da tela para melhor visualização.
    * **Identidade Visual:** Design minimalista com paleta de cores personalizada para cada gênero cinematográfico.

---

## 🛠️ Tecnologias Utilizadas

* **Python:** Utilizado para a estruturação lógica do dicionário de dados (`filmes_storage`) e geração automatizada do arquivo HTML final.
* **JavaScript (ES6+):** Motor de interatividade responsável pela lógica do sorteador, manipulação do DOM e gerenciamento do LocalStorage.
* **CSS3:** Estilização avançada com variáveis dinâmicas (`:root`), Flexbox, Grid e animações de transição.
* **HTML5:** Estruturação semântica e interface totalmente responsiva.

---

## 📦 Como Utilizar

1.  Acesse o repositório e faça o download do arquivo `index.html`
2.  Abra o arquivo em qualquer navegador moderno (Chrome, Firefox, Edge)
3.  Utilize o painel superior para personalizar sua lista. Todas as alterações serão mantidas automaticamente..
