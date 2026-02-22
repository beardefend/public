document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.bd-imgwrap img').forEach((img) => {
    const wrap = img.closest('.bd-imgwrap');
    if (!wrap) return;

    const done = () => wrap.classList.add('is-loaded');

    if (img.complete && img.naturalWidth > 0) done();
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true }); // fail open
  });
});
