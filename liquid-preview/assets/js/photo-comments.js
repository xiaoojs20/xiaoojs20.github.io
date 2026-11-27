const dialog = document.querySelector('[data-photo-comments-dialog]');
if (dialog instanceof HTMLDialogElement) {
    const name = dialog.querySelector('[data-photo-comments-name]');
    const status = dialog.querySelector('[data-photo-comments-status]');
    const root = dialog.querySelector('[data-photo-comments-root]');
    const serverURL = dialog.dataset.serverUrl || '';
    const chinese = dialog.dataset.language === 'zh-CN';
    let instance;
    let openSequence = 0;

    document.addEventListener('click', async (event) => {
        const button = event.target.closest('[data-photo-comment]');
        if (!button) return;
        event.preventDefault();
        const sequence = ++openSequence;
        name.textContent = button.dataset.photoTitle || '';
        status.textContent = chinese ? '评论功能正在准备中，暂时无法留言。' : 'Comments are being set up and are not available yet.';
        status.hidden = false;
        if (!dialog.open) dialog.showModal();
        if (!serverURL || !root) return;
        status.textContent = chinese ? '正在加载评论…' : 'Loading comments…';
        try {
            const { init } = await import('https://unpkg.com/@waline/client@v3/dist/waline.js');
            if (!dialog.open || sequence !== openSequence) return;
            instance?.destroy();
            root.replaceChildren();
            instance = init({
                el: root,
                serverURL,
                path: `/pictures/photo/${encodeURIComponent(button.dataset.photoComment)}/`,
                lang: dialog.dataset.language,
                dark: 'html[data-scheme="dark"]',
                meta: ['nick', 'mail'],
                requiredMeta: ['nick'],
                login: 'disable',
                imageUploader: false,
                pageview: false,
                reaction: false,
                emoji: [],
            });
            status.hidden = true;
        } catch {
            if (sequence === openSequence) status.textContent = chinese ? '评论加载失败，请稍后重试。' : 'Comments could not be loaded. Please try again later.';
        }
    });
    dialog.querySelector('[data-photo-comments-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
        openSequence++;
        instance?.destroy();
        instance = undefined;
        root?.replaceChildren();
    });
}
