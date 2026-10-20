/* ========================================
   MENU PARA CELULAR
======================================== */

// Copia os itens do menu do cachorro para o menu mobile.

const nav = document.querySelector('.menu');
const mobileNav = document.querySelector('.mbar');

if (nav && mobileNav) {
  mobileNav.innerHTML = nav.innerHTML.replace(
    '<span class="glider"></span>',
    ''
  );
}

/* ========================================
   ANIMAÇÃO DO CACHORRO
======================================== */

// O cachorro anima ao passar o mouse e termina
// o ciclo antes de voltar à imagem estática.

const dg = document.querySelector('.dog');
const CICLO = 4840;

new Image().src = 'assets/images/cachorro-anim.webp';

let t0 = 0;
let to;

/* Inicia a animação */

const ligar = () => {
  clearTimeout(to);

  if (!t0) {
    t0 = performance.now();
    dg.classList.add('play');
  }
};

/* Encerra a animação ao terminar o ciclo */

const desligar = () => {
  if (!t0) {
    return;
  }

  clearTimeout(to);

  to = setTimeout(() => {
    dg.classList.remove('play');
    t0 = 0;
  }, CICLO - ((performance.now() - t0) % CICLO));
};

/* Eventos do mouse e do teclado */

if (dg) {
  dg.addEventListener('mouseenter', ligar);
  dg.addEventListener('mouseleave', desligar);
  dg.addEventListener('focusin', ligar);
  dg.addEventListener('focusout', desligar);
  dg.addEventListener('touchstart', () => { ligar(); desligar(); }, { passive: true });
}

/* ========================================
   INDICADOR DO MENU
======================================== */

const gl = nav ? nav.querySelector('.glider') : null;
const its = nav ? [...nav.querySelectorAll('.item')] : [];

/* Retorna o item ativo ou o primeiro item do menu */

const act = () =>
  nav.querySelector('.item.active') || its[0];

/* Move o indicador para o item selecionado */

const mv = el => {
  if (!el || !gl) {
    return;
  }

  gl.style.width = `${el.offsetWidth}px`;
  gl.style.transform = `translateX(${el.offsetLeft}px)`;
};

/* Eventos de interação com os itens do menu */

its.forEach(i => {
  i.addEventListener('mouseenter', () => mv(i));
  i.addEventListener('focus', () => mv(i));
  i.addEventListener('mouseleave', () => mv(act()));
  i.addEventListener('blur', () => mv(act()));
});

/* Reposiciona o indicador ao redimensionar e ao carregar */

window.addEventListener('resize', () => mv(act()));
window.addEventListener('load', () => mv(act()));

/* ========================================
   INICIALIZAÇÃO
======================================== */

if (window.lucide && typeof window.lucide.createIcons === 'function') {
  window.lucide.createIcons();
}

mv(act());
