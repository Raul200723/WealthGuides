(function () {
  var bar = document.getElementById('reading-progress');
  var article = document.querySelector('.article-main');
  if (!bar || !article) return;

  function update() {
    var rect = article.getBoundingClientRect();
    var total = rect.height - window.innerHeight;
    var scrolled = Math.min(Math.max(-rect.top, 0), total);
    var pct = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + '%';
  }
  document.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
