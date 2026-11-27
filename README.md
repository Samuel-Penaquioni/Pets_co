# Pets_co
O Pets/co é um e-commerce de produtos para animais de estimação, oferecendo itens como rações, brinquedos, acessórios e produtos de higiene. O projeto busca proporcionar uma experiência de compra prática e intuitiva, utilizando um banco de dados para organizar produtos, categorias, clientes e pedidos.

---

## 📋 Funcionalidades

* **Catálogo de Produtos:** Listagem dinâmica integrada à API, busca e filtros por categoria/espécie, além da página individual de detalhes (`produtos.html` e `produto.html`).
* **Carrinho de Compras Interativo:** Cálculo automático de subtotal, indicador de progresso para frete grátis (compras acima de R$ 99,00), persistência no navegador e fechamento de pedido gravado no banco de dados.
* **Agendamento de Serviços:** Marcação online de banho, tosa e consultas veterinárias (`banho-e-tosa.html` e `veterinario.html`).
* **Área do Cliente e Painel Administrativo:** Cadastro e autenticação de tutores, gerenciamento de pets, acompanhamento de pedidos e histórico de agendamentos (`conta.html`).

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3, Tailwind CSS, JavaScript (ES6+) e ícones Lucide.
* **Backend:** Python 3, FastAPI, Uvicorn, SQLAlchemy, PyMySQL e Passlib (bcrypt).
* **Banco de Dados:** MySQL 8.0 (com script `.sql` standalone e rotina de *seed* automático).
* **Infraestrutura e Deploy:** Docker, Docker Compose, Nginx (servidor estático e proxy reverso para `/api/`).

---

## 📁 Estrutura do Projeto

```text
Pets_co/
├── assets/                  # Imagens, logotipo e fotos dos produtos
├── backend/                 # API REST desenvolvida em FastAPI
│   ├── main.py              # Definição das rotas e inicialização da aplicação
│   ├── models.py            # Modelos ORM das tabelas (SQLAlchemy)
│   ├── database.py          # Configuração de conexão e sessão com o MySQL
│   ├── seed.py              # Carga inicial de produtos e usuário administrador
│   ├── requirements.txt     # Dependências do ambiente Python
│   └── Dockerfile           # Instruções de build da imagem do backend
├── index.html               # Página inicial (vitrine e destaques)
├── produtos.html            # Catálogo completo com filtros
├── produto.html             # Página de detalhes do produto selecionado
├── banho-e-tosa.html        # Formulário de agendamento de banho e tosa
├── veterinario.html         # Formulário de agendamento clínico/veterinário
├── sobre.html               # Página institucional da Pets'co
├── conta.html               # Login, cadastro, perfil do tutor, pets e pedidos
├── script.js                # Cliente HTTP da API, header/footer dinâmicos e carrinho
├── pages.js                 # Lógica de renderização e eventos de cada página
├── data.js                  # Dados locais de fallback do catálogo
├── style.css                # Estilização customizada e animações
├── nginx.conf               # Configuração do Nginx e proxy reverso (/api -> backend)
├── Dockerfile               # Imagem do frontend (Nginx)
├── docker-compose.yml       # Orquestração dos serviços (Frontend, Backend e MySQL)
├── vercel.json              # Configuração de rewrites para deploy na Vercel
└── petsco_db.sql            # Script SQL completo para criação e carga do banco
```

---

## 🚀 Métodos de Execução

### 1. Execução Local com Docker Compose (Recomendado)

Ideal para subir toda a aplicação (Frontend, Backend e Banco de Dados MySQL) com um único comando:

1. Clone o repositório e acesse a pasta do projeto:
   ```bash
   git clone https://github.com/Samuel-Penaquioni/Pets_co.git
   cd Pets_co
   ```

2. Construa e inicie os containers:
   ```bash
   docker compose up --build
   ```

3. Acesse os endereços no navegador:
   * **Aplicação Web (Frontend):** `http://localhost:8080`
   * **Documentação Interativa da API (Swagger UI):** `http://localhost:8000/docs`

4. Para encerrar os containers:
   ```bash
   docker compose down
   ```

---

### 2. Execução Manual (Sem Docker)

Caso prefira rodar cada camada diretamente na sua máquina:

1. **Banco de Dados (MySQL 8.0+):**
   * Crie um banco de dados chamado `petsco_db`.
   * Importe o arquivo `petsco_db.sql` pelo MySQL Workbench, phpMyAdmin ou terminal:
     ```bash
     mysql -u root -p petsco_db < petsco_db.sql
     ```

2. **Backend (FastAPI):**
   * Acesse a pasta `backend` e instale as dependências:
     ```bash
     cd backend
     pip install -r requirements.txt
     ```
   * Defina a variável de ambiente `DATABASE_URL` apontando para o seu banco:
     ```bash
     export DATABASE_URL="mysql+pymysql://USUARIO:SENHA@localhost:3306/petsco_db"
     ```
   * Inicie o servidor Uvicorn:
     ```bash
     uvicorn main:app --reload --host 0.0.0.0 --port 8000
     ```

3. **Frontend:**
   * Sirva a raiz do projeto em um servidor web local (como Nginx ou extensão *Live Server*), garantindo que as requisições para `/api/` sejam encaminhadas para `http://localhost:8000/api/`.

---

## 🗄️ Modelagem do Banco de Dados

O banco relacional `petsco_db` é estruturado nas seguintes tabelas:

| Tabela | Descrição |
| :--- | :--- |
| `usuarios` | Armazena dados cadastrais dos clientes, senha criptografada e flag de administrador (`is_admin`). |
| `pets` | Cadastro dos animais de estimação vinculados a cada usuário (`usuario_id`). |
| `produtos` | Catálogo de itens à venda, preços, categorias, estoque e indicação de destaque. |
| `agendamentos` | Registros de serviços de banho, tosa e consultas veterinárias agendadas pelos tutores. |
| `pedidos` | Cabeçalho das compras realizadas, contendo subtotal, valor do frete, total e status. |
| `pedido_itens` | Relacionamento entre pedidos e produtos adquiridos, com quantidade e preço unitário. |

---

## 👥 Autores

Projeto desenvolvido por:

* **Bryan Gimenes**
* **Maria Clara Sachetto**
* **Samuel Vicente Penaquioni** — [GitHub](https://github.com/Samuel-Penaquioni)
