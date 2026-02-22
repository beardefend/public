document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.bd-share').forEach((wrap) => {
    const url = wrap.getAttribute('data-share-url') || window.location.href;
    const title = wrap.getAttribute('data-share-title') || document.title;
    const text = wrap.getAttribute('data-share-text') || '';

    const shareBtn = wrap.querySelector('[data-action="share"]');
    const copyBtn = wrap.querySelector('[data-action="copy"]');
    const copyLabel = wrap.querySelector('[data-copy-label]');

    if (shareBtn) {
      // Hide Share button if Web Share API isn't available (keeps UI clean)
      if (!navigator.share) {
        shareBtn.style.display = 'none';
      } else {
        shareBtn.addEventListener('click', async () => {
          try {
            await navigator.share({ title, text, url });
          } catch (e) {
            // user cancelled; no-op
          }
        });
      }
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(url);
          if (copyLabel) {
            const old = copyLabel.textContent;
            copyLabel.textContent = 'Copied';
            setTimeout(() => (copyLabel.textContent = old), 1400);
          }
        } catch (e) {
          // fallback prompt
          window.prompt('Copy link:', url);
        }
      });
    }
  });
});
