(function () {
  var tocLinks = document.querySelectorAll('.toc a');
  if (!tocLinks.length) return;
  var headings = Array.prototype.map.call(tocLinks, function (a) {
    return document.getElementById(a.getAttribute('href').slice(1));
  }).filter(Boolean);

  if (!('IntersectionObserver' in window) || !headings.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = document.querySelector('.toc a[href="#' + entry.target.id + '"]');
      if (!link) return;
      if (entry.isIntersecting) {
        tocLinks.forEach(function (l) { l.removeAttribute('aria-current'); });
        link.setAttribute('aria-current', 'true');
      }
    });
  }, { rootMargin: '-96px 0px -70% 0px' });

  headings.forEach(function (h) { observer.observe(h); });
})();
