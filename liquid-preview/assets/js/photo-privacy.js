/* Originals are encrypted before publication; the answer never appears in this bundle. */
(() => {
  const element = document.getElementById('photo-privacy-data');
  if (!element) return;
  const config = JSON.parse(element.textContent);
  const zh = document.documentElement.lang.toLowerCase().startsWith('zh');
  const text = (cn, en) => zh ? cn : en;
  const pathOf = source => new URL(source, location.href).pathname.split('/').map(decodeURIComponent).join('/');
  const entryFor = source => Object.hasOwn(config.photos, pathOf(source)) ? config.photos[pathOf(source)] : null;
  const bytes = value => Uint8Array.from(atob(value), character => character.charCodeAt(0));
  const encode = value => new TextEncoder().encode(value);
  const normalize = value => value.normalize('NFKC').trim().replace(/\s+/gu, ' ').toLowerCase();
  const make = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content) node.textContent = content;
    return node;
  };
  const dialog = make('dialog', 'photo-privacy-dialog');
  dialog.setAttribute('aria-labelledby', 'photo-privacy-title');
  const close = make('button', 'photo-privacy-dialog__close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', text('关闭', 'Close'));
  const title = make('h2', '', text('人像照片', 'Portrait photo'));
  title.id = 'photo-privacy-title';
  const form = make('form');
  const question = make('p');
  question.id = 'photo-privacy-question';
  const label = make('label', '', text('你的答案', 'Your answer'));
  label.htmlFor = 'photo-privacy-answer';
  const input = make('input');
  input.id = 'photo-privacy-answer';
  input.type = 'text';
  input.inputMode = 'text';
  input.enterKeyHint = 'go';
  input.placeholder = text('请输入姓名', 'Enter a name');
  input.autocomplete = 'off';
  input.autocapitalize = 'none';
  input.spellcheck = false;
  input.required = true;
  input.maxLength = 200;
  input.setAttribute('aria-describedby', question.id);
  const submit = make('button', 'photo-privacy-dialog__submit', text('解锁照片', 'Unlock photo'));
  submit.type = 'submit';
  const status = make('p');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const photo = make('img', 'photo-privacy-dialog__image');
  photo.hidden = true;
  const caption = make('p');
  caption.hidden = true;
  form.append(question, label, input, submit, status);
  dialog.append(close, title, form, photo, caption);
  document.body.append(dialog);
  let current = null;
  let generation = 0;
  let objectURL = null;
  let busy = false;
  let controller = null;
  let composing = false;
  let compositionEnter = false;
  input.addEventListener('compositionstart', () => { composing = true; compositionEnter = false; });
  input.addEventListener('compositionend', () => { composing = false; });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') compositionEnter = composing || event.isComposing || event.keyCode === 229;
  });
  input.addEventListener('keyup', event => {
    if (event.key === 'Enter') compositionEnter = false;
  });

  const clear = () => {
    generation++;
    controller?.abort();
    controller = null;
    current = null;
    busy = false;
    composing = false;
    compositionEnter = false;
    input.value = '';
    input.removeAttribute('aria-invalid');
    photo.removeAttribute('src');
    photo.hidden = true;
    caption.textContent = '';
    caption.hidden = true;
    if (objectURL) URL.revokeObjectURL(objectURL);
    objectURL = null;
    form.hidden = false;
    dialog.classList.remove('is-unlocked');
  };
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', clear);
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  const open = (source, description = '') => {
    const entry = entryFor(source);
    if (!entry || dialog.open) return;
    clear();
    current = {entry, source: pathOf(source), description};
    title.textContent = text('人像照片', 'Portrait photo');
    question.textContent = (zh && entry.question.zh) || entry.question.en;
    const supported = Boolean(window.isSecureContext && window.crypto?.subtle);
    const pending = !entry.slots.length;
    input.disabled = !supported || pending;
    submit.disabled = !supported || pending;
    status.textContent = !supported
      ? text('请使用支持加密功能的浏览器，通过 HTTPS 打开本站。', 'Please open this site over HTTPS in a browser that supports encryption.')
      : pending ? text('这张照片还未设置答案，暂时无法解锁。', 'An answer has not been set for this photo yet.')
        : text('答对后可查看；关闭照片后会重新锁定。', 'Answer correctly to view. The photo locks again when closed.');
    dialog.showModal();
    if (!input.disabled) input.focus();
  };
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !current || input.disabled || composing || compositionEnter) return;
    const answer = normalize(input.value);
    if (!answer) { input.focus(); return; }
    busy = true;
    submit.disabled = true;
    input.removeAttribute('aria-invalid');
    status.textContent = text('正在解锁…', 'Unlocking…');
    const token = generation;
    const selected = current;
    const {entry} = selected;
    const aad = encode(`blog-photo-privacy:v1:${selected.source}`);
    controller = new AbortController();
    try {
      const material = await crypto.subtle.importKey('raw', encode(answer), 'PBKDF2', false, ['deriveKey']);
      let fileKey = null;
      for (const slot of entry.slots) {
        if (token !== generation) return;
        const wrappingKey = await crypto.subtle.deriveKey(
          {name: 'PBKDF2', hash: 'SHA-256', salt: bytes(slot.salt), iterations: config.iterations},
          material, {name: 'AES-GCM', length: 256}, false, ['decrypt'],
        );
        try {
          const raw = await crypto.subtle.decrypt({name: 'AES-GCM', iv: bytes(slot.iv), additionalData: aad}, wrappingKey, bytes(slot.key));
          fileKey = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
          new Uint8Array(raw).fill(0);
          break;
        } catch (error) {
          if (error.name !== 'OperationError') throw error;
        }
      }
      if (token !== generation) return;
      if (!fileKey) {
        status.textContent = text('答案不对，再想一想。', 'That answer is not correct. Try again.');
        input.setAttribute('aria-invalid', 'true');
        input.select();
        return;
      }
      // Fetch only after a valid answer has unwrapped the image key.
      const response = await fetch(entry.file, {signal: controller.signal, credentials: 'omit', cache: 'no-store'});
      if (!response.ok) throw new Error('Image unavailable');
      const encrypted = await response.arrayBuffer();
      const decrypted = await crypto.subtle.decrypt({name: 'AES-GCM', iv: bytes(entry.iv), additionalData: aad}, fileKey, encrypted);
      if (token !== generation) return;
      objectURL = URL.createObjectURL(new Blob([decrypted], {type: entry.mime}));
      new Uint8Array(decrypted).fill(0);
      photo.src = objectURL;
      photo.alt = selected.description || text('已解锁的人像照片', 'Unlocked portrait photo');
      caption.textContent = selected.description;
      caption.hidden = !selected.description;
      input.value = '';
      form.hidden = true;
      photo.hidden = false;
      title.textContent = text('已解锁', 'Unlocked');
      dialog.classList.add('is-unlocked');
      close.focus();
    } catch (error) {
      if (token === generation && error.name !== 'AbortError') status.textContent = text('照片暂时无法加载，请稍后重试。', 'The photo could not be loaded. Please try again.');
    } finally {
      if (token === generation) { busy = false; submit.disabled = false; }
    }
  });
  const previewURL = source => {
    const entry = entryFor(source);
    if (!entry) return source;
    const url = new URL(source, location.href);
    // Avoid reusing a clear image cached before this photo became protected.
    url.searchParams.set('privacy', entry.previewSha256.slice(0, 16));
    return url.href;
  };
  window.PhotoPrivacy = Object.freeze({isProtected: source => Boolean(entryFor(source)), previewURL, open});

  // Capture before the photo wall's zoom handler; dragging and comment controls remain usable.
  document.querySelectorAll('[data-gallery-item]').forEach(item => {
    const image = item.querySelector('img');
    if (!image || !entryFor(image.src)) return;
    item.dataset.photoProtected = 'true';
    item.setAttribute('aria-label', `${image.alt} · ${text('回答问题查看人像', 'Answer a question to view this portrait')}`);
    const badge = make('span', 'photo-privacy-badge', text('🔒 回答问题查看', '🔒 Answer to view'));
    badge.setAttribute('aria-hidden', 'true');
    item.append(badge);
  });
  const intercept = event => {
    const item = event.target.closest?.('[data-photo-protected]');
    if (!item || event.target.closest('a, button') || item.dataset.suppressGalleryClick === 'true') return;
    if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const image = item.querySelector('img');
    open(image.src, image.alt);
  };
  document.addEventListener('click', intercept, true);
  document.addEventListener('keydown', intercept, true);
  window.addEventListener('pagehide', () => { if (dialog.open) dialog.close(); clear(); });
})();
