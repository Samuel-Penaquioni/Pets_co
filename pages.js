/* pages.js — lógica de cada página (escolhida por <body data-page="...">) */

const plano = (b, sz, teaser) => `
  <div class="card p-7 relative${b.hot ? ' ring-4 ring-g' : ''}">
    ${b.hot ? '<span class="absolute -top-3 right-5 bg-or text-white text-xs font-bold rounded-full px-3 py-1">Mais pedido</span>' : ''}
    <div class="text-4xl" aria-hidden="true">${b.e}</div>
    <h3 class="text-2xl font-semibold mt-3">${b.n}</h3>
    <p class="text-gd/70 mt-1">${b.d}</p>
    <p class="mt-4 text-xs text-gd/60">${teaser ? 'a partir de' : 'para o porte escolhido'}</p>
    <p class="t text-3xl font-bold text-g">${R(b.p[sz])}</p>
    <ul class="mt-3 space-y-1 text-sm">${b.i.map(x => `<li>✔ ${x}</li>`).join('')}</ul>
  </div>`;

const pg = {
  /* ---------- HOME: prévia de cada seção ---------- */
  inicio() {
    const ids = P.map((_, i) => i), dest = ids.filter(i => P[i][5]);
    $('#destaques').innerHTML = [...dest, ...ids.filter(i => !dest.includes(i))].slice(0, 4).map(card).join('');
    $('#planos').innerHTML = BANHO.map(b => plano(b, 0, 1)).join('');
    $('#vetprev').innerHTML = VET.slice(0, 4).map(([ic, n]) => `<div class="card p-5"><i data-lucide="${ic}" class="text-g w-8 h-8"></i><h3 class="font-semibold mt-2">${n}</h3></div>`).join('');
  },

  /* ---------- PRODUTOS: busca, categorias e ordenação ---------- */
  produtos() {
    let q = '', c = 'Todos', pet = 'Todos', s = '';
    $('#chips').innerHTML = ['Todos', ...CATS].map(x => `<button class="fchip${x === c ? ' on' : ''}" data-c="${x}">${x}</button>`).join('');
    const render = () => {
      const ids = P.map((_, i) => i).filter(i => {
        const [, n, , cat, pt] = P[i];
        return n.toLowerCase().includes(q) && (c === 'Todos' || cat === c) && (pet === 'Todos' || pt === pet || pt === 'Ambos');
      });
      if (s) ids.sort((a, b) => (s === 'asc' ? P[a][2] - P[b][2] : P[b][2] - P[a][2]));
      $('#grid').innerHTML = ids.map(card).join('') || '<p class="col-span-full text-center py-16 text-gd/70">Nenhum produto encontrado. Tente outra busca ou categoria 🐾</p>';
      $('#count').textContent = `${ids.length} ${ids.length === 1 ? 'produto' : 'produtos'}`;
      icons();
    };
    $('#chips').onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      c = b.dataset.c;
      $$('#chips button').forEach(x => x.classList.toggle('on', x === b));
      render();
    };
    $('#q').oninput = e => { q = e.target.value.trim().toLowerCase(); render(); };
    $('#pet').onchange = e => { pet = e.target.value; render(); };
    $('#ord').onchange = e => { s = e.target.value; render(); };
    render();
  }
};

(pg[PAGE] || (() => {}))();
icons();
mv(act());