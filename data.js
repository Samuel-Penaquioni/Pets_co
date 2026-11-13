/* data.js — produtos e serviços (edite aqui para mudar o conteúdo do site) */

// ['' (reservado), nome, preço, categoria, pet, destaque (1 = aparece na página inicial), foto, descrição, características (uma por linha, separadas por \n)]
// Descrição e características aparecem na página do produto (produto.html). Os textos abaixo são exemplos: edite à vontade.
// foto = nome do arquivo na pasta assets/produtos/ (sem extensão; pode ser .jpg, .webp ou .png).
// Enquanto a foto não existir, o site mostra uma patinha no lugar.
const P = [
  [
    "",
    "Ração Premium 10kg",
    189.9,
    "Alimentos",
    "Cães",
    1,
    "racao-premium-10kg",
    "Ração completa para cães adultos, pensada para uma alimentação equilibrada no dia a dia. Embalagem econômica de 10 kg.",
    "Embalagem de 10 kg\nPara cães adultos\nAlimento completo e balanceado\nArmazene em local fresco e seco",
  ],
  [
    "",
    "Petisco Ossinho",
    19.9,
    "Petiscos",
    "Cães",
    0,
    "petisco-ossinho",
    "Petisco em formato de ossinho para premiar seu cão nos treinos e nos momentos de carinho.",
    "Formato de ossinho\nIdeal para recompensas\nPara cães\nOferecer com moderação",
  ],
  [
    "",
    "Bolinha Mordedor",
    14.9,
    "Brinquedos",
    "Cães",
    0,
    "bolinha-mordedor",
    "Bolinha resistente para brincadeiras de buscar e morder, ajuda seu cão a gastar energia.",
    "Material resistente\nIdeal para buscar e morder\nFácil de limpar\nPara cães",
  ],
  [
    "",
    "Caminha Confort",
    99.9,
    "Conforto",
    "Cães",
    1,
    "caminha-confort",
    "Caminha macia e aconchegante para o seu cão descansar com conforto.",
    "Enchimento macio\nBorda para apoiar a cabeça\nFácil de lavar\nPara cães",
  ],
  [
    "",
    "Shampoo Neutro",
    29.9,
    "Higiene",
    "Cães",
    0,
    "shampoo-neutro",
    "Shampoo de fórmula neutra para banhos suaves, limpa sem agredir a pele e a pelagem.",
    "Fórmula neutra\nPara uso em cães\nAplicar, massagear e enxaguar bem\nEvite contato com os olhos",
  ],
  [
    "",
    "Coleira + Guia",
    49.9,
    "Acessórios",
    "Cães",
    0,
    "coleira-e-guia",
    "Conjunto de coleira e guia para passeios seguros e confortáveis.",
    "Coleira e guia no mesmo conjunto\nResistente\nPara cães\nConfira o tamanho antes de comprar",
  ],
  [
    "",
    "Sachê Gatos (12un)",
    39.9,
    "Alimentos",
    "Gatos",
    0,
    "sache-gatos-12un",
    "Caixa com 12 sachês para variar o cardápio do seu gato com praticidade.",
    "12 sachês por caixa\nPara gatos\nPorção individual, prática\nServir em temperatura ambiente",
  ],
  [
    "",
    "Pelúcia Sonora",
    24.9,
    "Brinquedos",
    "Cães",
    0,
    "pelucia-sonora",
    "Pelúcia com som para estimular a curiosidade e divertir seu cão.",
    "Emite som ao ser apertada\nMacia ao toque\nPara cães\nBrinque sempre com supervisão",
  ],
  [
    "",
    "Ração Gatos Castrados 3kg",
    79.9,
    "Alimentos",
    "Gatos",
    1,
    "racao-gatos-castrados-3kg",
    "Ração pensada para gatos castrados, ajuda a manter uma alimentação equilibrada.",
    "Embalagem de 3 kg\nPara gatos castrados\nAlimento completo\nArmazene em local fresco e seco",
  ],
  [
    "",
    "Varinha com Penas",
    17.9,
    "Brinquedos",
    "Gatos",
    0,
    "varinha-com-penas",
    "Varinha com penas que desperta o instinto caçador e diverte seu gato.",
    "Penas que estimulam a caça\nHaste leve\nPara gatos\nBrinque junto com seu gato",
  ],
  [
    "",
    "Areia Higiênica 4kg",
    22.9,
    "Higiene",
    "Gatos",
    0,
    "areia-higienica-4kg",
    "Areia higiênica para a caixinha do gato, em embalagem de 4 kg.",
    "Embalagem de 4 kg\nPara gatos\nTroque com regularidade\nMantenha a caixinha sempre limpa",
  ],
  [
    "",
    "Escova Tira-Pelos",
    34.9,
    "Higiene",
    "Cães",
    0,
    "escova-tira-pelos",
    "Escova para remover pelos soltos e manter a pelagem do seu cão limpa e macia.",
    "Remove pelos soltos\nPara cães\nFácil de limpar\nEscove com carinho e frequência",
  ],
  [
    "",
    "Comedouro Antiformiga",
    27.9,
    "Acessórios",
    "Ambos",
    0,
    "comedouro-antiformiga",
    "Comedouro com proteção contra formigas, para a comida ficar sempre limpa.",
    "Proteção antiformiga\nPara cães e gatos\nFácil de lavar\nBase estável",
  ],
  [
    "",
    "Bifinho de Frango",
    24.9,
    "Petiscos",
    "Cães",
    1,
    "bifinho-de-frango",
    "Bifinho sabor frango, um petisco irresistível para premiar seu cão.",
    "Sabor frango\nPara cães\nÓtimo para treinos\nOferecer com moderação",
  ],
  [
    "",
    "Arranhador Compacto",
    119.9,
    "Conforto",
    "Gatos",
    0,
    "arranhador-compacto",
    "Arranhador compacto para o gato afiar as unhas e ainda ter um cantinho de descanso.",
    "Tamanho compacto\nPara gatos\nAjuda a proteger sofás e móveis\nFácil de montar",
  ],
  [
    "",
    "Fonte de Água",
    89.9,
    "Acessórios",
    "Ambos",
    0,
    "fonte-de-agua",
    "Fonte de água que mantém a água circulando e estimula seu pet a beber mais.",
    "Água em movimento\nPara cães e gatos\nFácil de limpar\nFunciona ligada à tomada",
  ],
];

const CATS = [
  "Alimentos",
  "Petiscos",
  "Brinquedos",
  "Higiene",
  "Conforto",
  "Acessórios",
];

// p = preços por porte [pequeno, médio, grande]
const PORTES = [
  "Pequeno (até 10 kg)",
  "Médio (10 a 25 kg)",
  "Grande (acima de 25 kg)",
];

const BANHO = [
  {
    e: "🛁",
    n: "Banho Simples",
    d: "Banho, secagem e perfume.",
    p: [45, 60, 80],
    i: ["Shampoo neutro", "Limpeza de ouvidos", "Corte de unhas"],
  },
  {
    e: "✂️",
    n: "Banho + Tosa",
    d: "Visual novo, do jeito que ele gosta.",
    p: [75, 95, 125],
    i: [
      "Tudo do banho simples",
      "Tosa higiênica ou completa",
      "Hidratação de pelagem",
    ],
    hot: 1,
  },
  {
    e: "👑",
    n: "Spa Premium",
    d: "O dia de realeza do seu pet.",
    p: [110, 140, 180],
    i: ["Tudo do banho + tosa", "Escovação de dentes", "Laço ou gravatinha"],
  },
];

// [ícone lucide, nome, descrição, preço inicial]
const VET = [
  [
    "stethoscope",
    "Consulta clínica",
    "Avaliação completa e orientação para o tutor.",
    120,
  ],
  ["syringe", "Vacinação", "V8/V10, antirrábica e gripe canina.", 90],
  [
    "pill",
    "Vermífugo e antipulgas",
    "Proteção contra parasitas internos e externos.",
    60,
  ],
  ["microscope", "Exames", "Sangue, fezes e urina com laudo rápido.", 80],
  [
    "heart-pulse",
    "Check-up sênior",
    "Acompanhamento para pets a partir dos 7 anos.",
    180,
  ],
];

// Nomes fictícios: troque pelos da equipe real
const EQUIPE = [
  ["👩‍⚕️", "Dra. Camila Rocha", "Clínica geral e vacinação"],
  ["👨‍⚕️", "Dr. Rafael Almeida", "Gatos e animais silvestres"],
  ["👩‍⚕️", "Dra. Bianca Torres", "Exames e check-up sênior"],
];

const HORAS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

// Acesso do administrador (entre na aba "Entrar" com estes dados). Troque por valores seus.
// ATENÇÃO: como o site não tem servidor, estes dados ficam visíveis no navegador.
// Serve para a demonstração acadêmica; um sistema real valida o login no servidor.
const ADMIN_LOGIN = "admin";
const ADMIN_PASS = "petsco@2026";
