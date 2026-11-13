/* data.js — produtos e serviços (edite aqui para mudar o conteúdo do site) */

// [emoji, nome, preço, categoria, pet]
const P = [
  ["🍖", "Ração Premium 10kg", 189.9, "Alimentos", "Cães"],
  ["🦴", "Petisco Ossinho", 19.9, "Petiscos", "Cães"],
  ["🎾", "Bolinha Mordedor", 14.9, "Brinquedos", "Cães"],
  ["🛏️", "Caminha Confort", 99.9, "Conforto", "Cães"],
  ["🧴", "Shampoo Neutro", 29.9, "Higiene", "Cães"],
  ["🦮", "Coleira + Guia", 49.9, "Acessórios", "Cães"],
  ["🐟", "Sachê Gatos (12un)", 39.9, "Alimentos", "Gatos"],
  ["🧸", "Pelúcia Sonora", 24.9, "Brinquedos", "Cães"],
  ["🐱", "Ração Gatos Castrados 3kg", 79.9, "Alimentos", "Gatos"],
  ["🪶", "Varinha com Penas", 17.9, "Brinquedos", "Gatos"],
  ["🚽", "Areia Higiênica 4kg", 22.9, "Higiene", "Gatos"],
  ["🪮", "Escova Tira-Pelos", 34.9, "Higiene", "Cães"],
  ["🥣", "Comedouro Antiformiga", 27.9, "Acessórios", "Ambos"],
  ["🍗", "Bifinho de Frango", 24.9, "Petiscos", "Cães"],
  ["🧶", "Arranhador Compacto", 119.9, "Conforto", "Gatos"],
  ["💧", "Fonte de Água", 89.9, "Acessórios", "Ambos"],
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
