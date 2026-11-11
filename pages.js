/* pages.js — lógica de cada página (escolhida por <body data-page="...">) */

const fmtData = (d) => d.split("-").reverse().join("/");

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

  /* ---------- CONTA: entrar, cadastrar e painel do tutor ---------- */
  conta() {
    let tab = "login",
      sec = "resumo";
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
    const feitoTag =
      '<span class="bg-gl text-gd text-xs font-bold rounded-full px-2 py-0.5 ml-1">Concluído</span>';

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
          if (!all[em] || all[em].pass !== hash(g("senha")))
            return erro("E-mail ou senha incorretos. Confira e tente de novo.");
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
          login ? "Bem-vindo de volta! 🐶" : "Conta criada com sucesso! 🎉",
        );
        renderConta();
      };
    };

    const painel = {
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
        <button data-a="delconta" class="mt-6 text-sm font-bold text-red-700 underline">Excluir minha conta</button>`,
    };

    const dash = () => {
      const u = me();
      const sbtn = ([k, ic, t]) =>
        `<button class="snav${k === sec ? " on" : ""}" data-s="${k}"><i data-lucide="${ic}" class="w-4 h-4"></i>${t}</button>`;
      root.innerHTML = `<div class="grid md:grid-cols-4 gap-6 items-start">
        <aside class="card p-4"><div class="text-center py-3"><div class="text-5xl" aria-hidden="true">🐾</div><p class="t font-bold text-xl text-gd mt-1">${esc(u.name)}</p><p class="text-xs text-gd/60 break-all">${esc(u.email)}</p></div>
          <nav class="grid gap-1">${SEC.map(sbtn).join("")}
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
      p.onclick = (e) => {
        const b = e.target.closest("[data-a]");
        if (!b) return;
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
      p.onsubmit = (e) => {
        e.preventDefault();
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
