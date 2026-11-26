SET NAMES utf8mb4;
SET TIME_ZONE = '-03:00';
SET FOREIGN_KEY_CHECKS = 0;

-- Limpeza de tabelas existentes (permite reimportação segura)
-- ----------------------------------------------------------
DROP TABLE IF EXISTS pedido_itens;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS agendamentos;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS usuarios;


-- 1. Usuários
-- ----------------------------------------------------------
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    telefone VARCHAR(30) NULL,
    is_admin TINYINT(1) NOT NULL DEFAULT 0,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2. Pets
-- ----------------------------------------------------------
CREATE TABLE pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(80) NULL,
    idade VARCHAR(40) NULL,
    peso DECIMAL(5,2) NULL,
    observacoes TEXT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pets_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 3. Produtos
-- ----------------------------------------------------------
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(80) NOT NULL,
    pet VARCHAR(50) NOT NULL,
    destaque TINYINT(1) NOT NULL DEFAULT 0,
    foto VARCHAR(255) NULL,
    descricao TEXT NULL,
    caracteristicas TEXT NULL,
    estoque INT NOT NULL DEFAULT 100,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 4. Agendamentos (Banho & Tosa e Veterinário)
-- ----------------------------------------------------------
CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    pet_id INT NULL,
    pet_nome VARCHAR(100) NULL,
    tipo VARCHAR(50) NOT NULL,
    servico VARCHAR(120) NOT NULL,
    data_agendamento DATE NOT NULL,
    horario VARCHAR(20) NOT NULL,
    observacoes TEXT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'Agendado',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_agendamentos_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_agendamentos_pet FOREIGN KEY (pet_id)
        REFERENCES pets(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Pedidos e Itens de Pedido
-- ----------------------------------------------------------
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    frete DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(40) NOT NULL DEFAULT 'Confirmado',
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedidos_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pedido_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_itens_pedido FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id) ON DELETE CASCADE,
    CONSTRAINT fk_itens_produto FOREIGN KEY (produto_id)
        REFERENCES produtos(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO produtos (id, nome, preco, categoria, pet, destaque, foto, descricao, caracteristicas, estoque) VALUES
(1, 'Ração Premium Cães Adultos 10kg', 149.90, 'Rações', 'Cães', 1, 'racao-caes', 'Nutrição completa e balanceada para cães adultos de todas as raças.', 'Proteína de alta digestibilidade|Ômega 3 e 6 para pelagem|Sem corantes artificiais', 50),
(2, 'Ração Super Premium Gatos Castrados 3kg', 89.90, 'Rações', 'Gatos', 1, 'racao-gatos', 'Fórmula com controle de calorias e suporte ao trato urinário de gatos castrados.', 'Controle de peso|Equilíbrio mineral urinário|Sabor salmão e frango', 60),
(3, 'Petisco Natural Bifinho Carne 250g', 19.90, 'Petiscos', 'Cães', 1, 'bifinho-carne', 'Petisco macio feito com carnes selecionadas, ideal para adestramento.', '100% assado|Rico em proteínas|Alta palatabilidade', 120),
(4, 'Arranhador Torre com Bolinha', 119.90, 'Brinquedos', 'Gatos', 1, 'arranhador-gato', 'Torre revestida em sisal natural para aliviar o estresse e proteger os móveis.', 'Sisal natural resistente|Base estável antideslizante|Pompom suspenso', 25),
(5, 'Mordedor Corda Resistente', 24.90, 'Brinquedos', 'Cães', 0, 'mordedor-corda', 'Brinquedo de corda trançada que auxilia na limpeza mecânica dos dentes.', 'Algodão trançado|Auxilia na higiene bucal|Ideal para cabo de guerra', 80),
(6, 'Shampoo Neutro Pelos Macios 500ml', 32.90, 'Higiene', 'Todos', 1, 'shampoo-pet', 'Fórmula suave com extrato de aveia e aloe vera para peles sensíveis.', 'pH balanceado para pets|Extrato de aveia|Fácil enxágue', 70),
(7, 'Areia Higiênica Sílica Cristais 1,8kg', 44.90, 'Higiene', 'Gatos', 0, 'areia-silica', 'Alta absorção imediata com neutralização total de odores por até 30 dias.', 'Não forma poeira|Controle superior de odor|Rende até 1 mês', 45),
(8, 'Coleira Peitoral Ajustável com Guia', 59.90, 'Acessórios', 'Cães', 1, 'peitoral-guia', 'Peitoral ergonômico respirável com trava de segurança e guia de 1,20m.', 'Tecido respirável|Fivelas reforçadas|Ajuste em 4 pontos', 40),
(9, 'Comedouro Duplo Inox Antiderrapante', 39.90, 'Acessórios', 'Todos', 0, 'comedouro-inox', 'Tigelas removíveis em aço inoxidável higiênico com base emborrachada.', 'Aço inox fácil de lavar|Base antiderrapante|2 tigelas de 400ml', 55),
(10, 'Antipulgas e Carrapatos Mastigável', 79.90, 'Farmácia', 'Cães', 0, 'antipulgas', 'Proteção mensal rápida contra pulgas e carrapatos em tablete palatável.', 'Ação em até 3 horas|Proteção por 30 dias|Fácil administração', 35);

SET FOREIGN_KEY_CHECKS = 1;