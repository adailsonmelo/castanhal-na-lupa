(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const feedback = $('#action-feedback');
  const shareUrl = window.location.href;
  const shareTitle = document.title;
  const shareText = 'A comunidade pode acompanhar a contratação da reforma da Creche Sara de Souza Araújo, em Castanhal.';

  function say(msg, isError = false) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.classList.toggle('is-error', isError);
  }

  /* ---------- Menu mobile ---------- */
  const menuToggle = $('.menu-toggle');
  const menu = $('#menu-principal');
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    $$('a', menu).forEach((link) => link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- Cópia para a área de transferência (com fallback) ---------- */
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) { /* cai no fallback */ }
    }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '0';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) return true;
    } catch (_) { /* ignore */ }
    window.prompt('Copie o link abaixo:', text);
    return false;
  }

  /* ---------- Copiar link ---------- */
  async function copyLink() {
    const ok = await copyText(shareUrl);
    say(
      ok ? 'Link copiado. Cole no WhatsApp, e-mail ou onde quiser.'
         : 'Não foi possível copiar automaticamente. O link foi exibido para cópia manual.',
      !ok
    );
  }

  /* ---------- Compartilhar (nativo com fallback) ---------- */
  async function shareInvite() {
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        say('Convite compartilhado.');
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return; // usuário cancelou
        // segue para o fallback
      }
    }
    const ok = await copyText(shareUrl);
    say(
      ok ? 'Seu navegador não abriu o compartilhamento nativo. Copiamos o link para você colar onde quiser.'
         : 'Não foi possível compartilhar automaticamente. Copie o link manualmente.',
      !ok
    );
  }

  $$('#share-top, #share-bottom').forEach((btn) => btn.addEventListener('click', shareInvite));
  $$('#copy-link-top, #copy-link-bottom').forEach((btn) => btn.addEventListener('click', copyLink));

  /* ---------- Copiar perguntas ---------- */
  const questions = [
    'Quem solicitou a reforma e quais problemas foram identificados?',
    'Como foi calculado o valor estimado de R$ 700.735,64?',
    'Qual será o preço contratado e qual empresa executará a obra?',
    'Qual é o prazo de execução previsto no cronograma?',
    'Como a rotina das crianças e das famílias será afetada?',
    'Quem fiscalizará a execução e como será feita a entrega?'
  ].join('\n');

  const copyQuestions = $('#copy-questions');
  if (copyQuestions) {
    copyQuestions.addEventListener('click', async () => {
      const ok = await copyText(questions);
      say(
        ok ? 'Perguntas copiadas. Você pode compartilhá-las no grupo da comunidade.'
           : 'Não foi possível copiar automaticamente. As perguntas foram exibidas para cópia manual.',
        !ok
      );
    });
  }
})();