/* pages.js — lógica de cada página (escolhida por <body data-page="...">) */

const fmtData = (d) => d.split("-").reverse().join("/");
const escH = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

const plano = (b, sz, teaser) => `
  <div class="card p-7 relative${b.hot ? " ring-4 ring-g" : ""}">
    ${b.hot ? '<span class="absolute -top-3 right-5 bg-or text-white text-xs font-bold rounded-full px-3 py-1">Mais pedido</span>' : ""}
    <div class="text-4xl" aria-hidden="true">${b.e}</div>
    <h3 class="text-2xl font-semibold mt-3">${b.n}</h3>
    <p class="text-gd/70 mt-1">${b.d}</p>
    <p class="mt-4 text-xs text-gd/60">${teaser ? "a partir de" : "para o porte escolhido"}</p>
    <p class="t text-3xl font-bold text-g">${R(b.p[sz])}</p>
    <ul class="mt-3 space-y-1 text-sm">${b.i.map((x) => `<li>✔ ${x}</li>`).join("")}</ul>
  </div>`;

/* Formulário de agendamento (banho e tosa / veterinário) */
function bookingForm(kind) {
  const v = kind === "vet",
    u = me();
  const svcs = v ? VET.map((x) => x[1]) : BANHO.map((x) => x.n);
  const hoje = new Date().toISOString().slice(0, 10);
  $("#book").innerHTML = `
    <form id="bf" class="grid sm:grid-cols-2 gap-4">
      <div><label class="lbl" for="nome">Seu nome</label><input class="inp" id="nome" name="nome" required autocomplete="name" value="${u ? u.name : ""}"></div>
      <div><label class="lbl" for="tel">WhatsApp</label><input class="inp" id="tel" name="tel" type="tel" required autocomplete="tel" placeholder="(19) 90000-0000" value="${u ? u.phone || "" : ""}"></div>
      <div><label class="lbl" for="pet">Nome do pet</label><input class="inp" id="pet" name="pet" required list="pets"><datalist id="pets">${(u ? u.pets : []).map((p) => `<option value="${p.nome}">`).join("")}</datalist></div>
      <div><label class="lbl" for="extra">${v ? "Espécie" : "Porte"}</label><select class="inp" id="extra" name="extra">${(v ? ["Cachorro", "Gato", "Outro"] : PORTES).map((x, i) => `<option value="${i}">${x}</option>`).join("")}</select></div>
      <div class="sm:col-span-2"><label class="lbl" for="svc">Serviço</label><select class="inp" id="svc" name="svc">${svcs.map((x) => `<option>${x}</option>`).join("")}</select></div>
      <div><label class="lbl" for="data">Data</label><input class="inp" id="data" name="data" type="date" required min="${hoje}"></div>
      <div><label class="lbl" for="hora">Horário</label><select class="inp" id="hora" name="hora">${HORAS.map((h) => `<option>${h}</option>`).join("")}</select></div>
      <div class="sm:col-span-2"><label class="lbl" for="obs">${v ? "Motivo da consulta" : "Observações (opcional)"}</label><textarea class="inp" id="obs" name="obs" rows="2" placeholder="${v ? "Conte o que está acontecendo com seu pet" : "Alergias, temperamento, laço preferido…"}"></textarea></div>
      <p id="est" class="sm:col-span-2 t text-lg font-bold text-g"></p>
      <button class="btn bg-g text-white shadow-[0_5px_0_#3f5a22] justify-center sm:col-span-2"><i data-lucide="calendar-check" class="w-5 h-5"></i>Confirmar agendamento</button>
    </form>
    <div id="ok" class="hidden mt-5 rounded-2xl bg-gl p-5 text-gd" role="status"></div>`;

  const f = $("#bf"),
    g = (n) => f.elements[n];
  const est = () => {
    $("#est").textContent = v
      ? `Consulta a partir de ${R(VET[g("svc").selectedIndex][3])}`
      : `Valor estimado: ${R(BANHO[g("svc").selectedIndex].p[g("extra").value])}`;
  };
  f.addEventListener("change", est);
  est();

  f.onsubmit = (e) => {
    e.preventDefault();
    const d = new Date(g("data").value + "T12:00").getDay();
    if (d === 0)
      return toast("Não abrimos aos domingos. Escolha outra data 🐾");
    if (d === 6 && g("hora").value > "16:00")
      return toast(
        "Aos sábados atendemos até 17h. Escolha um horário mais cedo.",
      );
    const ag = {
      id: Date.now(),
      tipo: v ? "Veterinário" : "Banho e Tosa",
      svc: g("svc").value,
      pet: g("pet").value,
      data: g("data").value,
      hora: g("hora").value,
    };
    const logado = me();
    if (logado) {
      logado.appts.unshift(ag);
      saveMe(logado);
    }
    $("#ok").innerHTML =
      `<p class="font-bold">✅ Agendado! ${ag.pet} • ${ag.svc} • ${fmtData(ag.data)} às ${ag.hora}</p>
      <p class="text-sm mt-1">Enviaremos a confirmação pelo WhatsApp. ${logado ? '<a class="underline font-bold" href="conta.html">Ver em Minha conta</a>' : '<a class="underline font-bold" href="conta.html">Crie uma conta</a> para acompanhar seus agendamentos.'}</p>`;
    $("#ok").classList.remove("hidden");
    f.reset();
    est();
  };
}

const pg = {
  /* ---------- HOME: prévia de cada seção ---------- */
  inicio() {
    const ids = P.map((_, i) => i),
      dest = ids.filter((i) => P[i][5]);
    $("#destaques").innerHTML = [
      ...dest,
      ...ids.filter((i) => !dest.includes(i)),
    ]
      .slice(0, 4)
      .map(card)
      .join("");
    $("#planos").innerHTML = BANHO.map((b) => plano(b, 0, 1)).join("");
    $("#vetprev").innerHTML = VET.slice(0, 4)
      .map(
        ([ic, n]) =>
          `<div class="card p-5"><i data-lucide="${ic}" class="text-g w-8 h-8"></i><h3 class="font-semibold mt-2">${n}</h3></div>`,
      )
      .join("");
  },

  /* ---------- PRODUTOS: busca, categorias e ordenação ---------- */
  produtos() {
    let q = "",
      c = "Todos",
      pet = "Todos",
      s = "";
    $("#chips").innerHTML = ["Todos", ...CATS]
      .map(
        (x) =>
          `<button class="fchip${x === c ? " on" : ""}" data-c="${x}">${x}</button>`,
      )
      .join("");
    const render = () => {
      const ids = P.map((_, i) => i).filter((i) => {
        const [, n, , cat, pt] = P[i];
        return (
          n.toLowerCase().includes(q) &&
          (c === "Todos" || cat === c) &&
          (pet === "Todos" || pt === pet || pt === "Ambos")
        );
      });
      if (s)
        ids.sort((a, b) =>
          s === "asc" ? P[a][2] - P[b][2] : P[b][2] - P[a][2],
        );
      $("#grid").innerHTML =
        ids.map(card).join("") ||
        '<p class="col-span-full text-center py-16 text-gd/70">Nenhum produto encontrado. Tente outra busca ou categoria 🐾</p>';
      $("#count").textContent =
        `${ids.length} ${ids.length === 1 ? "produto" : "produtos"}`;
      icons();
    };
    $("#chips").onclick = (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      c = b.dataset.c;
      $$("#chips button").forEach((x) => x.classList.toggle("on", x === b));
      render();
    };
    $("#q").oninput = (e) => {
      q = e.target.value.trim().toLowerCase();
      render();
    };
    $("#pet").onchange = (e) => {
      pet = e.target.value;
      render();
    };
    $("#ord").onchange = (e) => {
      s = e.target.value;
      render();
    };
    render();
  },

  /* ---------- PÁGINA DO PRODUTO: detalhes, quantidade e relacionados ---------- */
  produto() {
    const box = $("#produto"),
      id = Number(new URLSearchParams(location.search).get("id")),
      pr = P[id];
    if (!pr || !Number.isInteger(id)) {
      box.innerHTML = `<div class="card p-10 text-center"><p class="t text-2xl font-bold text-gd">Produto não encontrado</p><p class="mt-2 text-gd/70">Ele pode ter saído da loja.</p><a href="produtos.html" class="btn bg-g text-white mt-5">Ver todos os produtos</a></div>`;
      return;
    }
    const [, n, v, c, pt, , , desc, car] = pr;
    document.title = `${n} — Pets’co`;
    const para = pt === "Ambos" ? "Cães e gatos" : pt;
    const itens = (car || "")
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
    const ids = P.map((_, i) => i).filter((i) => i !== id);
    const rel = [
      ...ids.filter((i) => P[i][3] === c),
      ...ids.filter(
        (i) => P[i][3] !== c && (P[i][4] === pt || P[i][4] === "Ambos"),
      ),
    ].slice(0, 4);
    const frete =
      v >= FRETE_GRATIS
        ? "Frete grátis para este produto"
        : `Frete grátis em compras acima de ${R(FRETE_GRATIS)}`;
    box.innerHTML = `
      <nav class="text-sm text-gd/70 mb-6" aria-label="Você está em"><a class="hover:underline" href="index.html">Início</a> › <a class="hover:underline" href="produtos.html">Produtos</a> › <span class="font-bold text-gd">${escH(n)}</span></nav>
      <div class="grid md:grid-cols-2 gap-10 items-start">
        <div class="pimg pfoto" aria-hidden="true">${fotoHTML(id)}</div>
        <div>
          <div class="flex flex-wrap gap-2"><span class="pbadge">${escH(c)}</span><span class="pbadge">${escH(para)}</span></div>
          <h1 class="text-3xl md:text-4xl font-bold text-gd mt-3 leading-tight">${escH(n)}</h1>
          <p class="t text-4xl font-bold text-g mt-3">${R(v)}</p>
          <p class="text-sm text-gd/70 mt-1">${escH(frete)}</p>
          <div class="flex flex-wrap items-center gap-4 mt-6">
            <div class="qtd" role="group" aria-label="Quantidade"><button type="button" data-q="-1" aria-label="Diminuir quantidade">−</button><b id="qv" aria-live="polite">1</b><button type="button" data-q="1" aria-label="Aumentar quantidade">+</button></div>
            <button id="addp" class="btn bg-g text-white shadow-[0_5px_0_#3f5a22]"><i data-lucide="shopping-cart" class="w-5 h-5"></i>Adicionar ao carrinho</button>
          </div>
          ${desc ? `<h2 class="text-xl font-bold text-gd mt-8">Sobre o produto</h2><p class="mt-2 text-gd/85 leading-relaxed">${escH(desc)}</p>` : ""}
          ${itens.length ? `<h2 class="text-xl font-bold text-gd mt-6">Características</h2><ul class="mt-2 space-y-2">${itens.map((x) => `<li class="flex gap-2 text-gd/85"><i data-lucide="check" class="w-5 h-5 text-g shrink-0"></i><span>${escH(x)}</span></li>`).join("")}</ul>` : ""}
          <div class="grid sm:grid-cols-3 gap-3 mt-8">
            <div class="card p-4 text-center text-sm"><i data-lucide="truck" class="w-7 h-7 mx-auto text-g"></i><p class="font-semibold mt-1">Entrega rápida</p></div>
            <div class="card p-4 text-center text-sm"><i data-lucide="shield-check" class="w-7 h-7 mx-auto text-g"></i><p class="font-semibold mt-1">Produto selecionado</p></div>
            <a class="card p-4 text-center text-sm" href="https://wa.me/5519000000000?text=${encodeURIComponent("Olá! Tenho uma dúvida sobre: " + n)}" target="_blank" rel="noopener"><i data-lucide="message-circle" class="w-7 h-7 mx-auto text-g"></i><p class="font-semibold mt-1">Tirar dúvidas</p></a>
          </div>
        </div>
      </div>
      ${rel.length ? `<h2 class="text-2xl font-bold text-gd mt-16">Você também pode gostar</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-5 mt-5">${rel.map(card).join("")}</div>` : ""}`;
    let q = 1;
    $$(".qtd button").forEach(
      (b) =>
        (b.onclick = () => {
          q = Math.max(1, Math.min(20, q + Number(b.dataset.q)));
          $("#qv").textContent = q;
        }),
    );
    $("#addp").onclick = () => {
      cart[id] = (cart[id] || 0) + q;
      draw();
      toast(`${q}× ${n} no carrinho 🛒`);
      $$(".badge").forEach((b) => {
        b.classList.remove("pop");
        void b.offsetWidth;
        b.classList.add("pop");
      });
    };
  },

  /* ---------- BANHO E TOSA: preço por porte + agendamento ---------- */
  banho() {
    let sz = 0;
    const render = () =>
      ($("#planos").innerHTML = BANHO.map((b) => plano(b, sz)).join(""));
    $("#sizes").innerHTML = PORTES.map(
      (x, i) =>
        `<button class="fchip${i ? "" : " on"}" data-i="${i}">${x}</button>`,
    ).join("");
    $("#sizes").onclick = (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      sz = +b.dataset.i;
      $$("#sizes button").forEach((x) => x.classList.toggle("on", x === b));
      render();
    };
    render();
    bookingForm("banho");
  },

  /* ---------- VETERINÁRIO ---------- */
  vet() {
    $("#vetsvc").innerHTML = VET.map(
      ([ic, n, d, v]) =>
        `<div class="card p-5"><i data-lucide="${ic}" class="text-g w-8 h-8"></i><h3 class="font-semibold mt-2">${n}</h3><p class="text-sm text-gd/70 mt-1">${d}</p><p class="t font-bold text-g mt-2">a partir de ${R(v)}</p></div>`,
    ).join("");
    $("#equipe").innerHTML = EQUIPE.map(
      ([e, n, d]) =>
        `<div class="card p-6 text-center"><div class="text-6xl bg-cr rounded-full w-24 h-24 mx-auto flex items-center justify-center" aria-hidden="true">${e}</div><h3 class="font-semibold text-lg mt-3">${n}</h3><p class="text-sm text-gd/70">${d}</p></div>`,
    ).join("");
    bookingForm("vet");
  },

  /* ---------- SOBRE: formulário de contato ---------- */
  sobre() {
    $("#contato").onsubmit = (e) => {
      e.preventDefault();
      e.target.reset();
      toast("Mensagem enviada! Respondemos em até 1 dia útil 💚");
    };
  },

  /* ---------- CONTA: entrar, cadastrar e painel do tutor ---------- */
  conta() {
    let tab = "login",
      sec = "resumo",
      pedit = -1,
      pfoto = null; // pfoto: null = sem mudança, '' = remover, texto = nova foto
    const root = $("#conta");
    const campo = (id, l, t = "text", x = "") =>
      `<div><label class="lbl" for="${id}">${l}</label><input class="inp" id="${id}" name="${id}" type="${t}" ${x}></div>`;
    const vazio = (e, msg, href, txt) =>
      `<div class="card p-8 text-center"><p class="text-5xl">${e}</p><p class="mt-2 text-gd/80">${msg}</p><a href="${href}" class="btn bg-g text-white mt-4 text-sm">${txt}</a></div>`;
    const EMO = { Cachorro: "🐶", Gato: "🐱", Outro: "🐰" };
    const SEC = [
      ["resumo", "layout-dashboard", "Resumo"],
      ["pets", "paw-print", "Meus pets"],
      ["agenda", "calendar-check", "Agendamentos"],
      ["pedidos", "package", "Pedidos"],
      ["dados", "settings", "Meus dados"],
    ];
    const ADM = [
      ["adm_resumo", "trending-up", "Visão geral"],
      ["adm_agenda", "calendar-range", "Todos os agendamentos"],
      ["adm_pedidos", "clipboard-list", "Todos os pedidos"],
      ["adm_produtos", "store", "Produtos"],
      ["adm_clientes", "users", "Clientes"],
    ];
    const OST = ["Em preparo", "Enviado", "Entregue", "Cancelado"];
    const esc = (s) =>
      String(s ?? "").replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[c],
      );
    const todos = () => Object.values(Users());
    const apptsAll = () =>
      todos().flatMap((c) => c.appts.map((a) => ({ ...a, c })));
    const ordersAll = () =>
      todos().flatMap((c) => c.orders.map((o) => ({ ...o, c })));
    const cmpAg = (a, b) => (a.data + a.hora).localeCompare(b.data + b.hora);
    const feitoTag =
      '<span class="bg-gl text-gd text-xs font-bold rounded-full px-2 py-0.5 ml-1">Concluído</span>';
    const vazioAdm = (msg) =>
      `<div class="card p-8 text-center text-gd/70"><p class="text-5xl">📭</p><p class="mt-2">${msg}</p></div>`;

    const auth = () => {
      const login = tab === "login";
      root.innerHTML = `<div class="grid md:grid-cols-5 gap-8 items-start">
        <div class="card p-7 md:col-span-3">
          <div class="flex gap-2 mb-6"><button class="fchip${login ? " on" : ""}" data-t="login">Entrar</button><button class="fchip${login ? "" : " on"}" data-t="reg">Criar conta</button></div>
          <form id="af" class="grid gap-4">
            ${login ? "" : campo("nome", "Nome completo", "text", 'required autocomplete="name"')}
            ${login ? campo("email", "E-mail ou usuário", "text", 'required autocomplete="username"') : campo("email", "E-mail", "email", 'required autocomplete="email"')}
            ${login ? "" : campo("tel", "WhatsApp", "tel", 'required autocomplete="tel" placeholder="(19) 90000-0000"')}
            ${campo("senha", "Senha", "password", `required minlength="6" autocomplete="${login ? "current-password" : "new-password"}"`)}
            <p id="err" class="text-sm font-bold text-red-700" role="alert"></p>
            <button class="btn bg-g text-white shadow-[0_5px_0_#3f5a22] justify-center">${login ? "Entrar na minha conta" : "Criar minha conta"}</button>
          </form>
          <p class="text-xs text-gd/60 mt-4">Demonstração acadêmica: os dados ficam salvos só neste navegador.</p>
        </div>
        <div class="bg-gl rounded-3xl p-7 md:col-span-2">
          <h2 class="text-2xl font-bold text-gd">Por que ter uma conta?</h2>
          <ul class="mt-4 space-y-3 text-gd/90">
            <li>🐾 Cadastre seus pets uma vez só</li><li>📅 Agende banho e consultas em poucos cliques</li><li>📦 Acompanhe seus pedidos</li><li>🎁 Receba ofertas para o seu tipo de pet</li>
          </ul>
        </div></div>`;
      $$("[data-t]").forEach(
        (b) =>
          (b.onclick = () => {
            tab = b.dataset.t;
            auth();
            icons();
          }),
      );
      $("#af").onsubmit = (e) => {
        e.preventDefault();
        const g = (n) => e.target.elements[n].value.trim(),
          erro = (m) => ($("#err").textContent = m);
        const em = g("email").toLowerCase(),
          all = Users();
        if (login) {
          if (em === ADMIN_LOGIN && hash(g("senha")) === hash(ADMIN_PASS)) {
            // acesso do administrador: login e senha definidos em data.js
            if (!all[em])
              saveMe({
                name: "Administrador",
                email: ADMIN_LOGIN,
                phone: "",
                pass: hash(ADMIN_PASS),
                role: "admin",
                pets: [],
                orders: [],
                appts: [],
              });
            else if (all[em].role !== "admin") {
              all[em].role = "admin";
              saveMe(all[em]);
            }
            sec = "adm_resumo";
          } else {
            if (
              !all[em] ||
              em === ADMIN_LOGIN ||
              all[em].pass !== hash(g("senha"))
            )
              return erro(
                "E-mail ou senha incorretos. Confira e tente de novo.",
              );
            if (all[em].role === "admin") sec = "adm_resumo";
          }
        } else {
          if (all[em])
            return erro("Este e-mail já tem cadastro. Use a aba Entrar.");
          saveMe({
            name: g("nome"),
            email: em,
            phone: g("tel"),
            pass: hash(g("senha")),
            role: "tutor",
            pets: [],
            orders: [],
            appts: [],
          });
        }
        LS.set("ps_me", em);
        who();
        const back = LS.get("ps_back");
        if (back) {
          LS.set("ps_back", null);
          location.href = back;
          return;
        }
        toast(
          login
            ? em === ADMIN_LOGIN
              ? "Painel do administrador liberado 🛡️"
              : "Bem-vindo de volta! 🐶"
            : "Conta criada com sucesso! 🎉",
        );
        renderConta();
      };
    };

    const painel = {
      adm_resumo: () => {
        const cl = todos(),
          ap = apptsAll(),
          od = ordersAll(),
          hoje = new Date().toISOString().slice(0, 10);
        const receita = od
          .filter((o) => o.status !== "Cancelado")
          .reduce((s, o) => s + o.total, 0);
        const prox = ap
          .filter((a) => a.data >= hoje && !a.feito)
          .sort(cmpAg)
          .slice(0, 5);
        const ult = od.sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, 5);
        const kpis = [
          [cl.filter((c) => c.role !== "admin").length, "clientes"],
          [cl.reduce((s, c) => s + c.pets.length, 0), "pets"],
          [ap.length, "agendamentos"],
          [od.length, "pedidos"],
          [R(receita), "em vendas"],
        ];
        return `<h2 class="text-2xl font-bold text-gd">Painel do administrador 🛡️</h2>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-5">${kpis.map(([n, l]) => `<div class="card p-4 text-center"><p class="t text-2xl font-bold text-g">${n}</p><p class="text-xs">${l}</p></div>`).join("")}</div>
          <div class="grid md:grid-cols-2 gap-5 mt-5">
            <div class="card p-6"><h3 class="font-semibold text-lg">Próximos agendamentos</h3>${prox.map((a) => `<p class="mt-2 text-sm"><b>${fmtData(a.data)} ${esc(a.hora)}</b> • ${esc(a.svc)} — ${esc(a.pet)}<br><span class="text-gd/70">${esc(a.c.name)}</span></p>`).join("") || '<p class="mt-2 text-gd/70">Nada marcado.</p>'}</div>
            <div class="card p-6"><h3 class="font-semibold text-lg">Últimos pedidos</h3>${ult.map((o) => `<p class="mt-2 text-sm"><b>Nº ${esc(o.id)}</b> • ${R(o.total)} • ${esc(o.status)}<br><span class="text-gd/70">${esc(o.c.name)}</span></p>`).join("") || '<p class="mt-2 text-gd/70">Nenhum pedido.</p>'}</div>
          </div>`;
      },
      adm_agenda: () =>
        `<h2 class="text-2xl font-bold text-gd">Todos os agendamentos</h2><div class="space-y-3 mt-5">${
          apptsAll()
            .sort(cmpAg)
            .map(
              (a) =>
                `<div class="card p-5 flex flex-wrap items-center gap-4"><div class="flex-1" style="min-width:200px"><p class="font-bold">${esc(a.svc)} — ${esc(a.pet)}${a.feito ? feitoTag : ""}</p><p class="text-sm text-gd/70">${esc(a.tipo)} • ${fmtData(a.data)} às ${esc(a.hora)}</p><p class="text-sm mt-1">👤 ${esc(a.c.name)} • ${esc(a.c.phone || "sem telefone")}</p></div>${a.feito ? "" : `<button data-a="adm_done" data-e="${esc(a.c.email)}" data-id="${a.id}" class="btn bg-g text-white text-sm px-4 py-2">Concluir</button>`}<button data-a="adm_cancel" data-e="${esc(a.c.email)}" data-id="${a.id}" class="text-red-700 text-sm font-bold">Cancelar</button></div>`,
            )
            .join("") || vazioAdm("Nenhum agendamento ainda.")
        }</div>`,
      adm_pedidos: () =>
        `<h2 class="text-2xl font-bold text-gd">Todos os pedidos</h2><div class="space-y-3 mt-5">${
          ordersAll()
            .sort((a, b) => (b.ts || 0) - (a.ts || 0))
            .map(
              (o) =>
                `<div class="card p-5"><div class="flex justify-between flex-wrap gap-2 items-center"><p class="font-bold">Pedido nº ${esc(o.id)} <span class="text-sm font-normal text-gd/70">• ${esc(o.date)}</span></p><select class="inp" style="width:auto" data-ost data-e="${esc(o.c.email)}" data-id="${esc(o.id)}" aria-label="Status do pedido ${esc(o.id)}">${OST.map((s) => `<option${s === o.status ? " selected" : ""}>${s}</option>`).join("")}</select></div><p class="text-sm mt-1">👤 ${esc(o.c.name)} • ${esc(o.c.phone || "sem telefone")}</p><p class="mt-2 text-sm">${o.items.map((x) => `${x.q}× ${esc(x.n)}`).join("<br>")}</p><p class="t font-bold text-g mt-2">${R(o.total)}</p></div>`,
            )
            .join("") || vazioAdm("Nenhum pedido ainda.")
        }</div>`,
      adm_produtos: () => {
        const e = pedit >= 0 ? P[pedit] : null;
        const cur = pfoto !== null ? pfoto : (e && e[6]) || "";
        return `<h2 class="text-2xl font-bold text-gd">Produtos da loja</h2>
          <form id="prf" class="card p-6 mt-5 grid sm:grid-cols-2 gap-4"><h3 class="font-semibold text-lg sm:col-span-2">${e ? "Editar produto" : "Adicionar produto"}</h3>
            ${campo("xn", "Nome", "text", `required maxlength="60" value="${esc(e ? e[1] : "")}"`)}
            ${campo("xp", "Preço (R$)", "number", `required min="0.01" step="0.01" value="${e ? e[2] : ""}"`)}
            <div><label class="lbl" for="xc">Categoria</label><input class="inp" id="xc" name="xc" list="xcl" required maxlength="30" value="${esc(e ? e[3] : "")}"><datalist id="xcl">${CATS.map((c) => `<option value="${esc(c)}">`).join("")}</datalist></div>
            <div><label class="lbl" for="xt">Para quem?</label><select class="inp" id="xt">${["Cães", "Gatos", "Ambos"].map((x) => `<option${e && e[4] === x ? " selected" : ""}>${x}</option>`).join("")}</select></div>
            <div class="sm:col-span-2"><label class="lbl" for="xds">Descrição (aparece na página do produto)</label><textarea class="inp" id="xds" rows="3" maxlength="600">${esc((e && e[7]) || "")}</textarea></div>
            <div class="sm:col-span-2"><label class="lbl" for="xcr">Características (uma por linha)</label><textarea class="inp" id="xcr" rows="4" maxlength="600" placeholder="Embalagem de 10 kg&#10;Para cães adultos">${esc((e && e[8]) || "")}</textarea></div>
            <div class="sm:col-span-2 flex flex-wrap items-center gap-4"><div id="xprev" class="pimg" style="width:96px;flex:none">${fotoBox(cur)}</div><div><label class="lbl" for="xf">Foto do produto</label><input type="file" id="xf" accept="image/*" class="text-sm"><p class="text-xs text-gd/60 mt-1">Ideal: quadrada, 800 × 800 px. O centro da imagem é cortado automaticamente.</p><button type="button" id="xrm" class="text-xs font-bold text-red-700 underline mt-1">Remover foto</button></div></div>
            <label class="flex items-center gap-3 font-bold text-gd self-end"><input type="checkbox" id="xd" class="w-5 h-5" style="accent-color:#678d3c"${e && e[5] ? " checked" : ""}>Mostrar em destaque na página inicial</label>
            <div class="sm:col-span-2 flex flex-wrap gap-3"><button class="btn bg-g text-white justify-center">${e ? "Salvar alterações" : "Adicionar produto"}</button>${e ? '<button type="button" data-a="adm_pcancel" class="btn bg-white text-gd shadow-[0_4px_0_#cfe39a]">Cancelar edição</button>' : ""}</div></form>
          <div class="flex flex-wrap justify-between items-center gap-2 mt-8"><h3 class="font-semibold text-lg">${P.length} ${P.length === 1 ? "produto" : "produtos"}</h3></div>
          <div class="space-y-3 mt-3">${P.map(([, n, v, c, pt, d, f], i) => `<div class="card p-4 flex flex-wrap items-center gap-4${i === pedit ? " ring-4 ring-g" : ""}"><span class="pimg thumb" aria-hidden="true">${fotoBox(f, esc(n))}</span><div class="flex-1" style="min-width:160px"><p class="font-bold">${esc(n)}${d ? ' <span class="bg-gl text-gd text-xs font-bold rounded-full px-2 py-0.5 ml-1">Destaque</span>' : ""}</p><p class="text-sm text-gd/70">${esc(c)} • ${esc(pt)} • <b class="text-g">${R(v)}</b></p></div><a href="produto.html?id=${i}" class="text-sm font-bold text-g underline">Ver página</a><button data-a="adm_pedit" data-i="${i}" class="btn bg-white text-gd text-sm px-4 py-2 shadow-[0_4px_0_#cfe39a]">Editar</button><button data-a="adm_pdel" data-i="${i}" class="text-red-700 text-sm font-bold">Excluir</button></div>`).join("") || vazioAdm("Nenhum produto cadastrado.")}</div>`;
      },
      adm_clientes: (u) =>
        `<h2 class="text-2xl font-bold text-gd">Clientes e administradores</h2><div class="space-y-3 mt-5">${todos()
          .map(
            (c) =>
              `<div class="card p-5 flex flex-wrap items-center gap-4"><div class="flex-1" style="min-width:200px"><p class="font-bold">${esc(c.name)} ${c.role === "admin" ? '<span class="bg-or text-white text-xs font-bold rounded-full px-2 py-0.5 ml-1">Admin</span>' : ""}</p><p class="text-sm text-gd/70 break-all">${esc(c.email)} • ${esc(c.phone || "sem telefone")}</p><p class="text-xs text-gd/60 mt-1">${c.pets.length} pets • ${c.appts.length} agendamentos • ${c.orders.length} pedidos</p></div>${c.email === ADMIN_LOGIN ? '<span class="text-xs text-gd/60">Conta principal</span>' : c.email === u.email ? '<span class="text-xs text-gd/60">Você</span>' : `<button data-a="adm_role" data-e="${esc(c.email)}" class="btn bg-white text-gd text-sm px-4 py-2 shadow-[0_4px_0_#cfe39a]">${c.role === "admin" ? "Remover admin" : "Tornar admin"}</button><button data-a="adm_del" data-e="${esc(c.email)}" class="text-red-700 text-sm font-bold">Excluir</button>`}</div>`,
          )
          .join("")}</div>`,
      resumo: (u) => {
        const prox = u.appts
          .filter((a) => a.data >= new Date().toISOString().slice(0, 10))
          .sort((a, b) => a.data.localeCompare(b.data))[0];
        return `<h2 class="text-2xl font-bold text-gd">Olá, ${u.name.split(" ")[0]}! 👋</h2>
          <div class="grid grid-cols-3 gap-4 mt-5">${[
            [u.pets.length, "pets"],
            [u.appts.length, "agendamentos"],
            [u.orders.length, "pedidos"],
          ]
            .map(
              ([n, l]) =>
                `<div class="card p-5 text-center"><p class="t text-3xl font-bold text-g">${n}</p><p class="text-sm">${l}</p></div>`,
            )
            .join("")}</div>
          <div class="card p-6 mt-5"><h3 class="font-semibold text-lg">Próximo agendamento</h3>${prox ? `<p class="mt-2">${prox.tipo} • ${prox.svc} para <b>${prox.pet}</b><br>${fmtData(prox.data)} às ${prox.hora}</p>` : '<p class="mt-2 text-gd/70">Nada marcado por enquanto.</p>'}</div>
          <div class="flex flex-wrap gap-3 mt-5"><a class="btn bg-g text-white text-sm" href="banho-e-tosa.html#agendar">Agendar banho</a><a class="btn bg-white text-gd text-sm shadow-[0_4px_0_#cfe39a]" href="veterinario.html#agendar">Marcar consulta</a><a class="btn bg-white text-gd text-sm shadow-[0_4px_0_#cfe39a]" href="produtos.html">Ir às compras</a></div>`;
      },
      pets: (u) => `<h2 class="text-2xl font-bold text-gd">Meus pets</h2>
        <div class="grid sm:grid-cols-2 gap-4 mt-5">${u.pets.map((p, i) => `<div class="card p-5 flex items-center gap-4"><span class="text-5xl" aria-hidden="true">${EMO[p.especie]}</span><div class="flex-1"><p class="font-bold text-lg">${p.nome}</p><p class="text-sm text-gd/70">${p.raca || "Sem raça definida"} • ${PORTES[p.porte].split(" (")[0]}</p></div><button data-a="delpet" data-i="${i}" class="text-red-700 text-sm font-bold" aria-label="Remover ${p.nome}">Remover</button></div>`).join("") || '<p class="text-gd/70 sm:col-span-2">Você ainda não cadastrou nenhum pet.</p>'}</div>
        <form id="pf" class="card p-6 mt-6 grid sm:grid-cols-2 gap-4"><h3 class="font-semibold text-lg sm:col-span-2">Adicionar pet</h3>
          ${campo("pn", "Nome", "text", "required")}${campo("pr", "Raça", "text", 'placeholder="Ex.: Dachshund"')}
          <div><label class="lbl" for="pe">Espécie</label><select class="inp" id="pe"><option>Cachorro</option><option>Gato</option><option>Outro</option></select></div>
          <div><label class="lbl" for="pp">Porte</label><select class="inp" id="pp">${PORTES.map((x, i) => `<option value="${i}">${x}</option>`).join("")}</select></div>
          <button class="btn bg-g text-white justify-center sm:col-span-2">Salvar pet</button></form>`,
      agenda: (u) =>
        `<h2 class="text-2xl font-bold text-gd">Agendamentos</h2><div class="space-y-3 mt-5">${u.appts.map((a, i) => `<div class="card p-5 flex items-center gap-4"><div class="flex-1"><p class="font-bold">${a.svc} — ${a.pet}${a.feito ? feitoTag : ""}</p><p class="text-sm text-gd/70">${a.tipo} • ${fmtData(a.data)} às ${a.hora}</p></div><button data-a="cancel" data-i="${i}" class="text-red-700 text-sm font-bold">Cancelar</button></div>`).join("") || vazio("📅", "Você não tem agendamentos.", "banho-e-tosa.html#agendar", "Agendar agora")}</div>`,
      pedidos: (u) =>
        `<h2 class="text-2xl font-bold text-gd">Pedidos</h2><div class="space-y-3 mt-5">${u.orders.map((o) => `<div class="card p-5"><div class="flex justify-between flex-wrap gap-2"><p class="font-bold">Pedido nº ${o.id}</p><span class="bg-gl text-gd text-xs font-bold rounded-full px-3 py-1">${o.status}</span></div><p class="text-sm text-gd/70">${o.date}</p><p class="mt-2 text-sm">${o.items.map((x) => `${x.q}× ${x.n}`).join("<br>")}</p><p class="t font-bold text-g mt-2">${R(o.total)}</p></div>`).join("") || vazio("📦", "Você ainda não fez nenhum pedido.", "produtos.html", "Ver produtos")}</div>`,
      dados: (u) => `<h2 class="text-2xl font-bold text-gd">Meus dados</h2>
        <form id="df" class="card p-6 mt-5 grid sm:grid-cols-2 gap-4">${campo("dn", "Nome", "text", `required value="${u.name}"`)}${campo("dt", "WhatsApp", "tel", `value="${u.phone || ""}"`)}
          <div class="sm:col-span-2"><label class="lbl" for="de">E-mail</label><input class="inp" id="de" value="${u.email}" disabled></div>
          <button class="btn bg-g text-white justify-center sm:col-span-2">Salvar alterações</button></form>
        ${u.email === ADMIN_LOGIN ? "" : '<button data-a="delconta" class="mt-6 text-sm font-bold text-red-700 underline">Excluir minha conta</button>'}`,
    };

    const dash = () => {
      const u = me(),
        isAdm = u.role === "admin";
      if (sec.startsWith("adm_") && !isAdm) sec = "resumo";
      const sbtn = ([k, ic, t]) =>
        `<button class="snav${k === sec ? " on" : ""}" data-s="${k}"><i data-lucide="${ic}" class="w-4 h-4"></i>${t}</button>`;
      root.innerHTML = `<div class="grid md:grid-cols-4 gap-6 items-start">
        <aside class="card p-4"><div class="text-center py-3"><div class="text-5xl" aria-hidden="true">${isAdm ? "🛡️" : "🐾"}</div><p class="t font-bold text-xl text-gd mt-1">${esc(u.name)}</p><p class="text-xs text-gd/60 break-all">${esc(u.email)}</p>${isAdm ? '<span class="inline-block mt-2 text-xs font-bold bg-or text-white rounded-full px-3 py-1">Administrador</span>' : ""}</div>
          <nav class="grid gap-1">${SEC.map(sbtn).join("")}${isAdm ? `<p class="text-xs font-bold uppercase text-gd/50 px-3 pt-3">Administração</p>${ADM.map(sbtn).join("")}` : ""}
          <button class="snav text-red-700" data-a="sair"><i data-lucide="log-out" class="w-4 h-4"></i>Sair</button></nav></aside>
        <section class="md:col-span-3" id="panel">${painel[sec](u)}</section></div>`;
      $$("[data-s]").forEach(
        (b) =>
          (b.onclick = () => {
            sec = b.dataset.s;
            dash();
            icons();
          }),
      );
      const p = $("#panel");
      // foto do produto: recorta o centro em quadrado e reduz (fica leve para salvar no navegador)
      const fi = $("#xf");
      if (fi) {
        const prev = (f) => {
          $("#xprev").className = "pimg";
          $("#xprev").innerHTML = fotoBox(f);
        };
        fi.onchange = () => {
          const arq = fi.files[0];
          if (!arq) return;
          const fr = new FileReader();
          fr.onload = () => {
            const im = new Image();
            im.onload = () => {
              const T = 700,
                cv = document.createElement("canvas"),
                s = Math.min(im.width, im.height);
              cv.width = cv.height = T;
              const g = cv.getContext("2d");
              g.fillStyle = "#fff";
              g.fillRect(0, 0, T, T);
              g.drawImage(
                im,
                (im.width - s) / 2,
                (im.height - s) / 2,
                s,
                s,
                0,
                0,
                T,
                T,
              );
              pfoto = cv.toDataURL("image/jpeg", 0.82);
              prev(pfoto);
            };
            im.onerror = () =>
              toast("Não consegui abrir essa imagem. Tente outro arquivo.");
            im.src = fr.result;
          };
          fr.readAsDataURL(arq);
        };
        $("#xrm").onclick = () => {
          pfoto = "";
          fi.value = "";
          prev("");
        };
      }
      p.onclick = (e) => {
        const b = e.target.closest("[data-a]");
        if (!b) return;
        if (b.dataset.a.startsWith("adm_")) return admAcao(b);
        const x = me(),
          i = +b.dataset.i;
        if (b.dataset.a === "delpet") x.pets.splice(i, 1);
        if (b.dataset.a === "cancel") {
          x.appts.splice(i, 1);
          toast("Agendamento cancelado");
        }
        if (b.dataset.a === "delconta") {
          if (!confirm("Excluir sua conta e todos os dados salvos?")) return;
          const all = Users();
          delete all[x.email];
          LS.set("ps_users", all);
          LS.set("ps_me", null);
          who();
          return renderConta();
        }
        saveMe(x);
        dash();
        icons();
      };
      // ações restritas ao administrador (sempre confere o perfil antes)
      const admAcao = (b) => {
        const adm = me();
        if (!adm || adm.role !== "admin")
          return toast("Acesso restrito a administradores");
        const acao = b.dataset.a;
        if (acao === "adm_pedit") {
          pedit = +b.dataset.i;
          pfoto = null;
          dash();
          icons();
          const f = $("#prf");
          if (f) f.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (acao === "adm_pcancel") {
          pedit = -1;
          pfoto = null;
          dash();
          icons();
          return;
        }
        if (acao === "adm_pdel") {
          const i = +b.dataset.i,
            pr = P[i];
          if (!pr || !confirm(`Excluir "${pr[1]}" da loja?`)) return;
          P.splice(i, 1);
          // o carrinho guarda o número do produto: reajusta para não trocar de item
          const nc = {};
          Object.keys(cart).forEach((k) => {
            const n = +k;
            if (n !== i) nc[n > i ? n - 1 : n] = cart[k];
          });
          cart = nc;
          if (pedit === i) {
            pedit = -1;
            pfoto = null;
          } else if (pedit > i) pedit--;
          saveProds();
          draw();
          toast("Produto excluído");
          dash();
          icons();
          return;
        }
        const all = Users(),
          c = all[b.dataset.e],
          id = +b.dataset.id;
        if (!c) return;
        if (acao === "adm_done") {
          const ap = c.appts.find((x) => x.id === id);
          if (ap) ap.feito = true;
          toast("Agendamento concluído ✅");
        }
        if (acao === "adm_cancel") {
          c.appts = c.appts.filter((x) => x.id !== id);
          toast("Agendamento cancelado");
        }
        if (acao === "adm_role") {
          if (c.email === adm.email) return;
          c.role = c.role === "admin" ? "tutor" : "admin";
          toast(
            c.role === "admin"
              ? `${c.name.split(" ")[0]} agora é administrador 🛡️`
              : "Acesso de administrador removido",
          );
        }
        if (acao === "adm_del") {
          if (
            c.email === adm.email ||
            !confirm(`Excluir a conta de ${c.name} e todos os dados dela?`)
          )
            return;
          delete all[c.email];
          LS.set("ps_users", all);
          dash();
          icons();
          return;
        }
        saveMe(c);
        dash();
        icons();
      };
      p.onchange = (e) => {
        const s = e.target;
        if (!s.hasAttribute("data-ost")) return;
        const adm = me();
        if (!adm || adm.role !== "admin")
          return toast("Acesso restrito a administradores");
        const c = Users()[s.dataset.e],
          o = c && c.orders.find((x) => x.id === s.dataset.id);
        if (!o) return;
        o.status = s.value;
        saveMe(c);
        toast("Status do pedido atualizado");
      };
      p.onsubmit = (e) => {
        e.preventDefault();
        if (e.target.id === "prf") {
          const adm = me();
          if (!adm || adm.role !== "admin")
            return toast("Acesso restrito a administradores");
          const limpa = (s) => s.trim().replace(/[<>]/g, "").replace(/"/g, "”");
          const prod = [
            "",
            limpa($("#xn").value),
            Math.round(parseFloat($("#xp").value) * 100) / 100,
            limpa($("#xc").value),
            $("#xt").value,
            $("#xd").checked ? 1 : 0,
          ];
          if (!prod[1] || !prod[3]) return toast("Preencha nome e categoria");
          if (!(prod[2] > 0)) return toast("Informe um preço válido");
          prod[6] = pfoto !== null ? pfoto : (pedit >= 0 && P[pedit][6]) || "";
          prod[7] = limpa($("#xds").value);
          prod[8] = limpa($("#xcr").value);
          const antes = P.map((x) => [...x]),
            editando = pedit >= 0;
          if (editando) P[pedit] = prod;
          else P.push(prod);
          if (!saveProds()) {
            P.length = 0;
            P.push(...antes);
            refreshCats();
            return toast(
              "Sem espaço para salvar tantas fotos. Use uma foto menor ou coloque os arquivos na pasta assets/produtos.",
            );
          }
          toast(editando ? "Produto atualizado ✅" : "Produto adicionado ✅");
          pedit = -1;
          pfoto = null;
          draw();
          dash();
          icons();
          return;
        }
        const x = me();
        if (e.target.id === "pf") {
          x.pets.push({
            nome: $("#pn").value.trim(),
            raca: $("#pr").value.trim(),
            especie: $("#pe").value,
            porte: +$("#pp").value,
          });
          toast("Pet cadastrado! 🐶");
        } else {
          x.name = $("#dn").value.trim();
          x.phone = $("#dt").value.trim();
          toast("Dados atualizados");
        }
        saveMe(x);
        who();
        dash();
        icons();
      };
    };

    // botão Sair (fora do #panel)
    root.addEventListener("click", (e) => {
      if (e.target.closest('[data-a="sair"]')) {
        LS.set("ps_me", null);
        who();
        sec = "resumo";
        renderConta();
        toast("Você saiu da conta. Até logo! 👋");
      }
    });
    window.renderConta = () => {
      me() ? dash() : auth();
      icons();
    };
    renderConta();
  },
};

(pg[PAGE] || (() => {}))();
icons();
mv(act());
