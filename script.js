/* script.js — comum a todas as páginas: cabeçalho, rodapé, carrinho, conta */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const R = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const icons = () => window.lucide && window.lucide.createIcons();
const LS = {
  get: (k, d) => {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v ?? d;
    } catch {
      return d;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};

/* ---------- Fotos dos produtos ---------- */
// foto pode ser: nome-sem-extensão (procura em assets/produtos/ como .jpg, .webp, .png ou .jpeg),
// um caminho com extensão, ou uma foto enviada pelo painel do administrador (data:).
const EXTS = ["jpg", "webp", "png", "jpeg"];
const FOTO_DIRETA = /^data:|\.(jpe?g|png|webp|gif|avif)$/i;
const fotoSrc = (f, t = 0) =>
  !f
    ? ""
    : FOTO_DIRETA.test(f)
      ? t
        ? ""
        : f
      : EXTS[t]
        ? `assets/produtos/${f}.${EXTS[t]}`
        : "";
function fotoErr(img) {
  const t = +img.dataset.t + 1,
    s = fotoSrc(img.dataset.f, t);
  if (s) {
    img.dataset.t = t;
    img.src = s;
  } else img.remove(); // sem foto: aparece o emoji
}
const PATINHA =
  '<span class="pph"><svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true"><ellipse cx="32" cy="42" rx="14" ry="11"/><circle cx="16" cy="28" r="6"/><circle cx="26" cy="17" r="6"/><circle cx="38" cy="17" r="6"/><circle cx="48" cy="28" r="6"/></svg></span>';
const fotoBox = (f, n = "") => {
  const s = fotoSrc(f),
    base = s && !FOTO_DIRETA.test(f);
  return `${PATINHA}${s ? `<img src="${s}" alt="${n}" loading="lazy"${base ? ` data-f="${f}" data-t="0" onerror="fotoErr(this)"` : ' onerror="this.remove()"'} onload="this.parentNode.classList.add('tem')">` : ""}`;
};
const fotoHTML = (i) => fotoBox(P[i][6], P[i][1]);

/* ---------- Conta (demonstrativo: dados ficam só neste navegador) ---------- */
const hash = (s) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return String(h);
};
const Users = () => LS.get("ps_users", {});
const me = () => Users()[LS.get("ps_me")] || null;
const saveMe = (u) => {
  const all = Users();
  all[u.email] = u;
  LS.set("ps_users", all);
};
const first = () => {
  const u = me();
  return u ? u.name.split(" ")[0].slice(0, 9) : "Entrar";
};

function toast(msg) {
  let t = $("#toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.setAttribute("role", "status");
    document.body.append(t);
  }
  t.textContent = msg;
  t.className = "show";
  clearTimeout(toast.t);
  toast.t = setTimeout(() => (t.className = ""), 2800);
}

/* ---------- Cabeçalho, rodapé e carrinho (injetados em todas as páginas) ---------- */
const PAGE = document.body.dataset.page || "inicio";

const NAV = [
  ["index.html", "house", "Início", "inicio"],
  ["produtos.html", "shopping-bag", "Produtos", "produtos"],
  ["banho-e-tosa.html", "scissors", "Banho e Tosa", "banho"],
  ["veterinario.html", "stethoscope", "Veterinário", "vet"],
  ["sobre.html", "info", "Sobre nós", "sobre"],
  ["conta.html", "user", "Entrar", "conta"],
  ["#carrinho", "shopping-cart", "Carrinho", "cart"],
];

function layout() {
  const items = NAV.map(([h, ic, t, k]) => {
    const ico = k === "conta" || k === "cart";
    return `<a href="${h}" class="item${ico ? " ico" : ""}${k === PAGE ? " active" : ""}${k === "cart" ? " js-cart" : ""}${k === "conta" ? " who" : ""}" data-k="${k}"${ico ? ` aria-label="${t}" title="${t}"` : ""}>
      <i data-lucide="${ic}"></i>${ico ? "" : `<span>${t}</span>`}${k === "cart" ? '<span class="badge">0</span>' : ""}
    </a>`;
  }).join("");

  const links = NAV.slice(0, 6)
    .map(
      ([h, , t, k]) =>
        `<li><a class="hover:text-white" href="${h}">${k === "conta" ? "Minha conta" : t}</a></li>`,
    )
    .join("");

  document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <a href="#main" class="skip">Ir para o conteúdo</a>
    <header class="top"><div class="top-in">
      <a href="index.html" class="logo" aria-label="Pets’co — página inicial"><img src="assets/images/petsco-logo.png" alt="Pets’co" /></a>
      <div class="dog">
        <div class="parte frente"></div>
        <nav class="menu" aria-label="Menu principal"><span class="glider"></span><span class="collar" aria-hidden="true"></span>${items}</nav>
        <div class="parte tras"></div>
      </div>
      <nav class="mbar" aria-label="Menu"></nav>
    </div></header>`,
  );

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <footer class="foot">
      <div class="foot-in">
        <div class="foot-cta">
          <div>
            <p class="t foot-cta-t">Seu pet merece o melhor 🐾</p>
            <p class="foot-cta-s">Agende o banho ou a consulta em poucos cliques.</p>
          </div>
          <div class="foot-cta-b">
            <a href="banho-e-tosa.html#agendar" class="btn bg-gl text-gd"><i data-lucide="calendar-check" class="w-5 h-5"></i>Agendar banho</a>
            <a href="https://wa.me/5519000000000" target="_blank" rel="noopener" class="btn foot-ghost"><i data-lucide="message-circle" class="w-5 h-5"></i>WhatsApp</a>
          </div>
        </div>

        <div class="foot-grid">
          <div>
            <a href="index.html" class="foot-logo" aria-label="Pets’co — página inicial"><img src="assets/images/petsco-logo.png" alt="Pets’co" /></a>
            <p class="foot-txt">Banho, tosa, veterinário e loja num só lugar. Cuidado e carinho para o seu melhor amigo.</p>
            <div class="foot-soc">
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
              <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
              <a href="https://wa.me/5519000000000" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg></a>
            </div>
          </div>
          <div>
            <p class="foot-h">Navegue</p>
            <ul class="foot-links">${links}</ul>
          </div>
          <div>
            <p class="foot-h">Contato</p>
            <ul class="foot-info">
              <li><i data-lucide="map-pin"></i><span>Rua Exemplo, 123 — Centro</span></li>
              <li><i data-lucide="phone"></i><span>(19) 0000-0000</span></li>
              <li><i data-lucide="mail"></i><span>contato@petsco.com.br</span></li>
            </ul>
          </div>
          <div>
            <p class="foot-h">Horário <span id="aberto" class="foot-open"></span></p>
            <ul class="foot-hours">
              <li><span>Seg a Sex</span><b>8h às 19h</b></li>
              <li><span>Sábado</span><b>8h às 17h</b></li>
              <li><span>Domingo</span><b>Fechado</b></li>
            </ul>
          </div>
        </div>

        <div class="foot-bottom">
          <p>© 2026 Pets’co — Projeto acadêmico FATEC</p>
          <p>Feito com 💚 para os pets</p>
        </div>
      </div>
    </footer>
    <a class="wpp" href="https://wa.me/5519000000000" target="_blank" rel="noopener" aria-label="Falar pelo WhatsApp"><i data-lucide="message-circle"></i></a>
    <div id="shade"></div>
    <aside id="drawer" aria-label="Carrinho" inert>
      <div class="flex items-center justify-between p-5 border-b border-gl">
        <h2 class="text-2xl font-bold text-gd">Seu carrinho</h2>
        <button id="closeCart" aria-label="Fechar carrinho"><i data-lucide="x"></i></button>
      </div>
      <div class="px-5 pt-4"><p id="ship" class="text-sm font-semibold text-gd"></p><div class="h-2 rounded-full bg-gl mt-1 overflow-hidden"><div id="bar" class="h-full bg-g transition-all" style="width:0"></div></div></div>
      <div id="items" class="flex-1 overflow-y-auto p-5 space-y-3"></div>
      <div class="p-5 border-t border-gl text-sm space-y-1">
        <div class="flex justify-between"><span>Subtotal</span><span id="sub">R$ 0,00</span></div>
        <div class="flex justify-between"><span>Frete</span><span id="frete">—</span></div>
        <div class="flex justify-between t text-xl font-bold text-gd pt-1"><span>Total</span><span id="total">R$ 0,00</span></div>
        <button class="btn bg-g text-white w-full justify-center mt-3 shadow-[0_5px_0_#3f5a22]" id="checkoutBtn">Finalizar compra</button>
        <p class="text-xs text-gd/60 text-center pt-1">Página demonstrativa: nenhum pagamento real é processado.</p>
      </div>
    </aside>`,
  );

  // menu mobile: cópia do menu do cachorro (sem o indicador)
  $(".mbar").innerHTML = $(".menu").innerHTML.replace(
    '<span class="glider"></span>',
    "",
  );

  // selo "Aberto agora / Fechado agora" no rodapé
  const d = new Date(),
    dia = d.getDay(),
    hr = d.getHours() + d.getMinutes() / 60;
  const aberto =
    dia >= 1 && dia <= 5
      ? hr >= 8 && hr < 19
      : dia === 6
        ? hr >= 8 && hr < 17
        : false;
  const st = $("#aberto");
  if (st) {
    st.textContent = aberto ? "Aberto agora" : "Fechado agora";
    st.classList.toggle("on", aberto);
  }
}

/* ---------- Carrinho ---------- */
const FRETE_GRATIS = 99,
  FRETE = 12.9;
let cart = LS.get("ps_cart", {});

const card = (i) => {
  const [e, n, v, c] = P[i];
  return `<article class="card p-5 text-center flex flex-col">
    <div class="pimg" aria-hidden="true">${fotoHTML(i)}</div>
    <p class="text-xs font-bold text-g mt-3">${c}</p>
    <h3 class="font-semibold leading-tight mt-1 flex-1">${n}</h3>
    <p class="t text-xl font-bold text-g mt-1">${R(v)}</p>
    <button onclick="add(${i})" class="btn bg-g text-white mt-3 text-sm px-4 py-2 w-full justify-center" aria-label="Adicionar ${n} ao carrinho">
      <i data-lucide="shopping-cart" class="w-4 h-4"></i>Adicionar
    </button>
  </article>`;
};

function add(i) {
  cart[i] = (cart[i] || 0) + 1;
  draw();
  toast(`${P[i][1]} no carrinho 🛒`);
  $$(".badge").forEach((b) => {
    b.classList.remove("pop");
    void b.offsetWidth;
    b.classList.add("pop");
  });
}

function chg(i, d) {
  cart[i] += d;
  if (cart[i] <= 0) delete cart[i];
  draw();
}

function draw() {
  const k = Object.keys(cart).filter((i) => P[i]);
  let n = 0,
    t = 0;

  $("#items").innerHTML = k.length
    ? k
        .map((i) => {
          n += cart[i];
          t += cart[i] * P[i][2];
          return `<div class="flex items-center gap-3 bg-cr rounded-xl p-3">
      <span class="pimg thumb" aria-hidden="true">${fotoHTML(i)}</span>
      <div class="flex-1 text-sm"><p class="font-bold">${P[i][1]}</p><p class="text-g font-bold">${R(P[i][2])}</p></div>
      <button onclick="chg(${i}, -1)" class="w-7 h-7 rounded-full bg-gl font-bold" aria-label="Diminuir quantidade de ${P[i][1]}">−</button>
      <b>${cart[i]}</b>
      <button onclick="chg(${i}, 1)" class="w-7 h-7 rounded-full bg-gl font-bold" aria-label="Aumentar quantidade de ${P[i][1]}">+</button>
    </div>`;
        })
        .join("")
    : `<div class="text-center mt-10 text-gd/70"><p class="text-5xl">🐾</p><p class="mt-2">Seu carrinho está vazio.</p><a href="produtos.html" class="btn bg-g text-white mt-4 text-sm">Ver produtos</a></div>`;

  const frete = !t || t >= FRETE_GRATIS ? 0 : FRETE;
  $$(".badge").forEach((b) => {
    b.textContent = n;
    b.style.display = n ? "flex" : "none";
  });
  $("#sub").textContent = R(t);
  $("#frete").textContent = !t ? "—" : frete ? R(frete) : "Grátis";
  $("#total").textContent = R(t + frete);
  $("#bar").style.width = Math.min(100, (t / FRETE_GRATIS) * 100) + "%";
  $("#ship").textContent = !t
    ? `Frete grátis acima de ${R(FRETE_GRATIS)}`
    : t >= FRETE_GRATIS
      ? "🎉 Você ganhou frete grátis!"
      : `Faltam ${R(FRETE_GRATIS - t)} para o frete grátis`;
  LS.set("ps_cart", cart);
}

const dr = $("#drawer") || null;
function openCart(e) {
  if (e) e.preventDefault();
  $("#drawer").inert = false;
  $("#drawer").classList.add("open");
  $("#shade").classList.add("open");
}
function closeCart() {
  $("#drawer").classList.remove("open");
  $("#shade").classList.remove("open");
  $("#drawer").inert = true;
}

function checkout() {
  const k = Object.keys(cart).filter((i) => P[i]);
  if (!k.length)
    return toast("Seu carrinho está vazio. Adicione um produto 🐾");
  const u = me();
  if (!u) {
    LS.set(
      "ps_back",
      (location.pathname.split("/").pop() || "index.html") + "#carrinho",
    );
    toast("Entre na sua conta para finalizar a compra");
    return setTimeout(() => (location.href = "conta.html"), 1000);
  }
  const sub = k.reduce((s, i) => s + cart[i] * P[i][2], 0);
  u.orders.unshift({
    id: String(Date.now()).slice(-6),
    date: new Date().toLocaleDateString("pt-BR"),
    items: k.map((i) => ({ e: P[i][0], n: P[i][1], q: cart[i] })),
    total: sub + (sub >= FRETE_GRATIS ? 0 : FRETE),
    status: "Em preparo",
    ts: Date.now(),
  });
  saveMe(u);
  cart = {};
  draw();
  closeCart();
  toast("Pedido realizado! Veja em Minha conta 🎉");
  if (window.renderConta) renderConta();
}

/* ---------- Menu do cachorro: indicador e animação ---------- */
const nav = () => $(".menu");
const gl = () => $(".glider");
const act = () => $(".menu .item.active") || $(".menu .item");
let prev = null;
try {
  prev = JSON.parse(sessionStorage.getItem("ps_gl"));
} catch {}
if (prev && prev.vw !== innerWidth) prev = null;
let liberado = !prev; // enquanto falso, o indicador fica onde estava na página anterior
let glSet = false;
const glSalvar = (el) => {
  glSet = true;
  try {
    sessionStorage.setItem(
      "ps_gl",
      JSON.stringify({ x: el.offsetLeft, w: el.offsetWidth, vw: innerWidth }),
    );
  } catch {}
};
const mv = (el) => {
  if (!el || !gl()) return;
  const x = liberado ? el.offsetLeft : prev.x,
    w = liberado ? el.offsetWidth : prev.w;
  gl().style.width = `${w}px`;
  gl().style.transform = `translateX(${x}px)`;
};
let dogLigar, dogDesligar;
const who = () => {
  const u = me(),
    t = u ? `Minha conta (${first()})` : "Entrar";
  $$(".who").forEach((w) => {
    w.title = t;
    w.setAttribute("aria-label", t);
    w.classList.toggle("logged", !!u);
  });
  mv(act());
};

function menuSetup() {
  $$(".menu .item").forEach((i) => {
    i.addEventListener("mouseenter", () => mv(i));
    i.addEventListener("focus", () => mv(i));
    i.addEventListener("mouseleave", () => mv(act()));
    i.addEventListener("blur", () => mv(act()));
  });
  window.addEventListener("resize", () => mv(act()));
  window.addEventListener("load", () => mv(act()));
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() =>
    mv(act()),
  );

  // cachorro: anima ao passar o mouse e termina o ciclo antes de voltar à imagem parada
  const dg = $(".dog"),
    CICLO = 4840;
  new Image().src = "assets/images/cachorro-anim.webp";
  let t0 = 0,
    to;
  const ligar = () => {
    clearTimeout(to);
    if (!t0) {
      t0 = performance.now();
      dg.classList.add("play");
    }
  };
  const desligar = () => {
    if (!t0) return;
    clearTimeout(to);
    to = setTimeout(
      () => {
        dg.classList.remove("play");
        t0 = 0;
      },
      CICLO - ((performance.now() - t0) % CICLO),
    );
  };
  dg.addEventListener("mouseenter", ligar);
  dg.addEventListener("mouseleave", desligar);
  dg.addEventListener("focusin", ligar);
  dg.addEventListener("focusout", desligar);
  dg.addEventListener(
    "touchstart",
    () => {
      ligar();
      desligar();
    },
    { passive: true },
  );
  dogLigar = ligar;
  dogDesligar = desligar;
  if (prev) $(".menu").classList.add("chega");

  // troca de página: conteúdo some suave, indicador desliza até a aba clicada
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (
      !a ||
      e.defaultPrevented ||
      e.button ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    const h = a.getAttribute("href");
    if (!h || h[0] === "#" || a.target || /^(https?:|mailto:|tel:)/i.test(h))
      return;
    if (new URL(a.href, location.href).pathname === location.pathname) return;
    e.preventDefault();
    if (a.closest(".menu")) {
      mv(a);
      glSalvar(a);
    }
    document.documentElement.classList.add("saindo");
    try {
      sessionStorage.setItem("ps_nav", "1");
    } catch {}
    setTimeout(() => (location.href = a.href), 240);
  });
  window.addEventListener("pagehide", () => {
    if (!glSet && act()) glSalvar(act());
  });
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) document.documentElement.classList.remove("saindo");
  });
}

/* ---------- Inicialização ---------- */
layout();
$$(".js-cart").forEach((a) => (a.onclick = openCart));
$("#closeCart").onclick = closeCart;
$("#shade").onclick = closeCart;
$("#checkoutBtn").onclick = checkout;
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});
menuSetup();
who();
draw();
icons();
mv(act());
if (location.hash === "#carrinho") openCart();

/* ---------- Mostra a página só quando estiver pronta (evita piscar ao trocar de página) ---------- */
const imgOk = (src) => {
  const i = new Image();
  i.src = src;
  return i.decode ? i.decode().catch(() => {}) : Promise.resolve();
};
function mostrar() {
  const m = $(".menu");
  document.documentElement.classList.add("ok");
  if (m) {
    m.classList.add("ready");
    void m.offsetWidth;
    liberado = true;
    mv(act());
  }
  // ao chegar de outra página, o cachorro dá uma abanada
  let veio = false;
  try {
    veio = sessionStorage.getItem("ps_nav");
    sessionStorage.removeItem("ps_nav");
  } catch {}
  if (
    veio &&
    dogLigar &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    dogLigar();
    dogDesligar();
  }
}
function quandoPronto() {
  Promise.race([
    Promise.all([
      document.fonts ? document.fonts.ready : 0,
      imgOk("assets/images/cachorro-parado.webp"),
      imgOk("assets/images/petsco-logo.png"),
    ]),
    new Promise((r) => setTimeout(r, 1800)),
  ]).then(() => requestAnimationFrame(() => requestAnimationFrame(mostrar)));
}
document.readyState === "complete"
  ? quandoPronto()
  : window.addEventListener("load", quandoPronto);
